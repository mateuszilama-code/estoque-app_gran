import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { FornecedoresService } from '../fornecedores/fornecedores.service';
import { ProdutosService } from '../produtos/produtos.service';
import { ProdutoFornecedor } from './entities/produto-fornecedor.entity';
import { ProdutoFornecedorService } from './produto-fornecedor.service';

/**
 * Testes unitários do ProdutoFornecedorService.
 *
 * O model de junção e os services de Produto/Fornecedor são mockados, então os
 * testes exercitam apenas as regras da associação N:N (os 3 cenários do PDF:
 * associar, associação duplicada e desassociar), sem tocar o banco.
 */
describe('ProdutoFornecedorService', () => {
  let service: ProdutoFornecedorService;
  let model: { findOne: jest.Mock; create: jest.Mock };
  let produtosService: { findOne: jest.Mock };
  let fornecedoresService: { findOne: jest.Mock };

  beforeEach(async () => {
    model = { findOne: jest.fn(), create: jest.fn() };
    produtosService = { findOne: jest.fn() };
    fornecedoresService = { findOne: jest.fn() };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoFornecedorService,
        { provide: getModelToken(ProdutoFornecedor), useValue: model },
        { provide: ProdutosService, useValue: produtosService },
        { provide: FornecedoresService, useValue: fornecedoresService },
      ],
    }).compile();

    service = moduleRef.get(ProdutoFornecedorService);
  });

  describe('associar', () => {
    it('associa o fornecedor ao produto quando o par é inédito', async () => {
      produtosService.findOne.mockResolvedValue({ id: 1 });
      fornecedoresService.findOne.mockResolvedValue({ id: 2 });
      model.findOne.mockResolvedValue(null);
      model.create.mockResolvedValue({ id: 10, produto_id: 1, fornecedor_id: 2 });

      const resultado = await service.associar(1, 2);

      expect(resultado).toEqual({
        message: 'Fornecedor associado com sucesso ao produto!',
        produto_id: 1,
        fornecedor_id: 2,
      });
      expect(model.create).toHaveBeenCalledWith({ produto_id: 1, fornecedor_id: 2 });
    });

    it('lança ConflictException com a mensagem do desafio quando o par já existe', async () => {
      produtosService.findOne.mockResolvedValue({ id: 1 });
      fornecedoresService.findOne.mockResolvedValue({ id: 2 });
      model.findOne.mockResolvedValue({ id: 10, produto_id: 1, fornecedor_id: 2 });

      await expect(service.associar(1, 2)).rejects.toBeInstanceOf(ConflictException);
      await expect(service.associar(1, 2)).rejects.toThrow(
        'Fornecedor já está associado a este produto!',
      );
      expect(model.create).not.toHaveBeenCalled();
    });

    it('propaga NotFoundException quando o produto não existe', async () => {
      produtosService.findOne.mockRejectedValue(new NotFoundException('Produto com id 999 não encontrado.'));

      await expect(service.associar(999, 2)).rejects.toBeInstanceOf(NotFoundException);
      expect(fornecedoresService.findOne).not.toHaveBeenCalled();
      expect(model.create).not.toHaveBeenCalled();
    });

    it('propaga NotFoundException quando o fornecedor não existe', async () => {
      produtosService.findOne.mockResolvedValue({ id: 1 });
      fornecedoresService.findOne.mockRejectedValue(
        new NotFoundException('Fornecedor com id 999 não encontrado.'),
      );

      await expect(service.associar(1, 999)).rejects.toBeInstanceOf(NotFoundException);
      expect(model.create).not.toHaveBeenCalled();
    });
  });

  describe('desassociar', () => {
    it('remove a associação existente e retorna a mensagem de sucesso', async () => {
      const associacao = { id: 10, destroy: jest.fn().mockResolvedValue(undefined) };
      model.findOne.mockResolvedValue(associacao);

      const resultado = await service.desassociar(1, 2);

      expect(associacao.destroy).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual({ message: 'Fornecedor desassociado com sucesso!' });
    });

    it('lança NotFoundException quando o par não está associado', async () => {
      model.findOne.mockResolvedValue(null);

      await expect(service.desassociar(1, 2)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('listagens', () => {
    it('lista os fornecedores de um produto', async () => {
      const fornecedores = [{ id: 2, nome_empresa: 'Tech' }];
      const produto = { id: 1, $get: jest.fn().mockResolvedValue(fornecedores) };
      produtosService.findOne.mockResolvedValue(produto);

      await expect(service.listarFornecedoresDoProduto(1)).resolves.toBe(fornecedores);
      expect(produto.$get).toHaveBeenCalledWith('fornecedores', { joinTableAttributes: [] });
    });

    it('lista os produtos de um fornecedor', async () => {
      const produtos = [{ id: 1, nome: 'Notebook' }];
      const fornecedor = { id: 2, $get: jest.fn().mockResolvedValue(produtos) };
      fornecedoresService.findOne.mockResolvedValue(fornecedor);

      await expect(service.listarProdutosDoFornecedor(2)).resolves.toBe(produtos);
      expect(fornecedor.$get).toHaveBeenCalledWith('produtos', { joinTableAttributes: [] });
    });

    it('propaga NotFoundException ao listar fornecedores de um produto inexistente', async () => {
      produtosService.findOne.mockRejectedValue(new NotFoundException('Produto com id 999 não encontrado.'));

      await expect(service.listarFornecedoresDoProduto(999)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
