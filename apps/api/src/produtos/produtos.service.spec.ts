import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { CategoriaProduto } from './enums/categoria-produto.enum';
import { Produto } from './entities/produto.entity';
import { ProdutosService } from './produtos.service';

/**
 * Testes unitários do ProdutosService.
 *
 * O model do Sequelize é substituído por um mock (via getModelToken), de modo
 * que os testes exercitam apenas as regras de negócio, sem tocar o banco.
 */
describe('ProdutosService', () => {
  let service: ProdutosService;
  let model: {
    findOne: jest.Mock;
    findByPk: jest.Mock;
    findAll: jest.Mock;
    create: jest.Mock;
  };

  const dtoValido: CreateProdutoDto = {
    nome: 'Notebook 14"',
    codigo_barras: '7891000100001',
    descricao: 'Notebook para uso corporativo, 16GB RAM.',
    quantidade_estoque: 15,
    categoria: CategoriaProduto.ELETRONICOS,
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
        ProdutosService,
        { provide: getModelToken(Produto), useValue: model },
      ],
    }).compile();

    service = moduleRef.get(ProdutosService);
  });

  describe('create', () => {
    it('cadastra o produto quando o código de barras é inédito', async () => {
      const criado = { id: 1, ...dtoValido };
      model.findOne.mockResolvedValue(null);
      model.create.mockResolvedValue(criado);

      await expect(service.create(dtoValido)).resolves.toEqual(criado);
      expect(model.findOne).toHaveBeenCalledWith({
        where: { codigo_barras: dtoValido.codigo_barras },
      });
      expect(model.create).toHaveBeenCalledTimes(1);
    });

    it('cadastra sem checar unicidade quando o código de barras é omitido', async () => {
      const semCodigo: CreateProdutoDto = {
        nome: 'Camiseta Básica',
        descricao: 'Camiseta de algodão, unissex.',
        categoria: CategoriaProduto.VESTUARIO,
      };
      model.create.mockResolvedValue({ id: 2, ...semCodigo });

      await service.create(semCodigo);

      expect(model.findOne).not.toHaveBeenCalled();
      expect(model.create).toHaveBeenCalledTimes(1);
    });

    it('lança ConflictException com a mensagem do desafio quando o código já existe', async () => {
      model.findOne.mockResolvedValue({ id: 1, ...dtoValido });

      await expect(service.create(dtoValido)).rejects.toBeInstanceOf(ConflictException);
      await expect(service.create(dtoValido)).rejects.toThrow(
        'Produto com este código de barras já está cadastrado!',
      );
      expect(model.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('retorna a lista ordenada por nome', async () => {
      const lista = [{ id: 1, ...dtoValido }];
      model.findAll.mockResolvedValue(lista);

      await expect(service.findAll()).resolves.toBe(lista);
      expect(model.findAll).toHaveBeenCalledWith({ order: [['nome', 'ASC']] });
    });
  });

  describe('findOne', () => {
    it('retorna o produto existente', async () => {
      const encontrado = { id: 1, ...dtoValido };
      model.findByPk.mockResolvedValue(encontrado);

      await expect(service.findOne(1)).resolves.toBe(encontrado);
    });

    it('lança NotFoundException quando o produto não existe', async () => {
      model.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update', () => {
    it('atualiza os campos quando o produto existe', async () => {
      const instancia = {
        id: 1,
        ...dtoValido,
        update: jest.fn().mockResolvedValue({ id: 1, ...dtoValido, quantidade_estoque: 20 }),
      };
      model.findByPk.mockResolvedValue(instancia);

      const resultado = await service.update(1, { quantidade_estoque: 20 });

      expect(instancia.update).toHaveBeenCalledWith({ quantidade_estoque: 20 });
      expect(resultado.quantidade_estoque).toBe(20);
      // Código de barras não mudou → não deve checar unicidade
      expect(model.findOne).not.toHaveBeenCalled();
    });

    it('lança ConflictException ao alterar o código de barras para um já cadastrado', async () => {
      const instancia = { id: 1, ...dtoValido, update: jest.fn() };
      model.findByPk.mockResolvedValue(instancia);
      model.findOne.mockResolvedValue({ id: 2, ...dtoValido, codigo_barras: '7891000200002' });

      await expect(
        service.update(1, { codigo_barras: '7891000200002' }),
      ).rejects.toThrow('Produto com este código de barras já está cadastrado!');
      expect(instancia.update).not.toHaveBeenCalled();
    });

    it('lança NotFoundException ao atualizar produto inexistente', async () => {
      model.findByPk.mockResolvedValue(null);

      await expect(service.update(999, { quantidade_estoque: 5 })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('remove o produto existente', async () => {
      const instancia = { id: 1, ...dtoValido, destroy: jest.fn().mockResolvedValue(undefined) };
      model.findByPk.mockResolvedValue(instancia);

      await service.remove(1);

      expect(instancia.destroy).toHaveBeenCalledTimes(1);
    });

    it('lança NotFoundException ao remover produto inexistente', async () => {
      model.findByPk.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
