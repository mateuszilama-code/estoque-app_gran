import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { Fornecedor } from './entities/fornecedor.entity';
import { FornecedoresService } from './fornecedores.service';

/**
 * Testes unitários do FornecedoresService.
 *
 * O model do Sequelize é substituído por um mock (via getModelToken), de modo
 * que os testes exercitam apenas as regras de negócio, sem tocar o banco.
 */
describe('FornecedoresService', () => {
  let service: FornecedoresService;
  let model: {
    findOne: jest.Mock;
    findByPk: jest.Mock;
    findAll: jest.Mock;
    create: jest.Mock;
  };

  const dtoValido: CreateFornecedorDto = {
    nome_empresa: 'Tech Distribuidora LTDA',
    cnpj: '12.345.678/0001-90',
    endereco: 'Rua das Palmeiras, 100 - São Paulo/SP',
    telefone: '(11) 3333-4444',
    email: 'contato@techdistribuidora.com',
    contato_principal: 'Ana Souza',
  };

  beforeEach(async () => {
    model = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        FornecedoresService,
        { provide: getModelToken(Fornecedor), useValue: model },
      ],
    }).compile();

    service = moduleRef.get(FornecedoresService);
  });

  describe('create', () => {
    it('cadastra o fornecedor quando o CNPJ é inédito', async () => {
      const criado = { id: 1, ...dtoValido };
      model.findOne.mockResolvedValue(null);
      model.create.mockResolvedValue(criado);

      await expect(service.create(dtoValido)).resolves.toEqual(criado);
      expect(model.findOne).toHaveBeenCalledWith({ where: { cnpj: dtoValido.cnpj } });
      expect(model.create).toHaveBeenCalledTimes(1);
    });

    it('lança ConflictException com a mensagem do desafio quando o CNPJ já existe', async () => {
      model.findOne.mockResolvedValue({ id: 1, ...dtoValido });

      await expect(service.create(dtoValido)).rejects.toBeInstanceOf(ConflictException);
      await expect(service.create(dtoValido)).rejects.toThrow(
        'Fornecedor com esse CNPJ já está cadastrado!',
      );
      expect(model.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('retorna a lista ordenada por nome_empresa', async () => {
      const lista = [{ id: 1, ...dtoValido }];
      model.findAll.mockResolvedValue(lista);

      await expect(service.findAll()).resolves.toBe(lista);
      expect(model.findAll).toHaveBeenCalledWith({ order: [['nome_empresa', 'ASC']] });
    });
  });

  describe('findOne', () => {
    it('retorna o fornecedor existente', async () => {
      const encontrado = { id: 1, ...dtoValido };
      model.findByPk.mockResolvedValue(encontrado);

      await expect(service.findOne(1)).resolves.toBe(encontrado);
    });

    it('lança NotFoundException quando o fornecedor não existe', async () => {
      model.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update', () => {
    it('atualiza os campos quando o fornecedor existe', async () => {
      const instancia = {
        id: 1,
        ...dtoValido,
        update: jest.fn().mockResolvedValue({ id: 1, ...dtoValido, telefone: '(11) 90000-0000' }),
      };
      model.findByPk.mockResolvedValue(instancia);

      const resultado = await service.update(1, { telefone: '(11) 90000-0000' });

      expect(instancia.update).toHaveBeenCalledWith({ telefone: '(11) 90000-0000' });
      expect(resultado.telefone).toBe('(11) 90000-0000');
      // CNPJ não mudou → não deve checar unicidade
      expect(model.findOne).not.toHaveBeenCalled();
    });

    it('lança ConflictException ao alterar o CNPJ para um já cadastrado', async () => {
      const instancia = { id: 1, ...dtoValido, update: jest.fn() };
      model.findByPk.mockResolvedValue(instancia);
      model.findOne.mockResolvedValue({ id: 2, ...dtoValido, cnpj: '98.765.432/0001-10' });

      await expect(
        service.update(1, { cnpj: '98.765.432/0001-10' }),
      ).rejects.toThrow('Fornecedor com esse CNPJ já está cadastrado!');
      expect(instancia.update).not.toHaveBeenCalled();
    });

    it('lança NotFoundException ao atualizar fornecedor inexistente', async () => {
      model.findByPk.mockResolvedValue(null);

      await expect(service.update(999, { telefone: '(11) 90000-0000' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('remove o fornecedor existente', async () => {
      const instancia = { id: 1, ...dtoValido, destroy: jest.fn().mockResolvedValue(undefined) };
      model.findByPk.mockResolvedValue(instancia);

      await service.remove(1);

      expect(instancia.destroy).toHaveBeenCalledTimes(1);
    });

    it('lança NotFoundException ao remover fornecedor inexistente', async () => {
      model.findByPk.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
