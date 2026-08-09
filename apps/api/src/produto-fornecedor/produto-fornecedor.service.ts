import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Fornecedor } from '../fornecedores/entities/fornecedor.entity';
import { FornecedoresService } from '../fornecedores/fornecedores.service';
import { Produto } from '../produtos/entities/produto.entity';
import { ProdutosService } from '../produtos/produtos.service';
import { ProdutoFornecedor } from './entities/produto-fornecedor.entity';

/**
 * Regras de negócio da associação (N:N) entre Produto e Fornecedor.
 *
 * Reutiliza `ProdutosService`/`FornecedoresService` para validar a existência
 * (retornando 404 quando produto/fornecedor não existem) e o model de junção
 * `ProdutoFornecedor` para criar/remover/consultar as associações. O par
 * (produto, fornecedor) é único — reassociar dispara 409 com a mensagem
 * "Fornecedor já está associado a este produto!".
 */
@Injectable()
export class ProdutoFornecedorService {
  constructor(
    @InjectModel(ProdutoFornecedor)
    private readonly associacaoModel: typeof ProdutoFornecedor,
    private readonly produtosService: ProdutosService,
    private readonly fornecedoresService: FornecedoresService,
  ) {}

  /** Associa um fornecedor a um produto (bloqueia duplicidade). */
  async associar(
    produtoId: number,
    fornecedorId: number,
  ): Promise<{ message: string; produto_id: number; fornecedor_id: number }> {
    // Valida existência (lançam 404 com a mensagem de cada domínio).
    await this.produtosService.findOne(produtoId);
    await this.fornecedoresService.findOne(fornecedorId);

    const jaAssociado = await this.associacaoModel.findOne({
      where: { produto_id: produtoId, fornecedor_id: fornecedorId },
    });
    if (jaAssociado) {
      throw new ConflictException('Fornecedor já está associado a este produto!');
    }

    await this.associacaoModel.create({ produto_id: produtoId, fornecedor_id: fornecedorId });
    return {
      message: 'Fornecedor associado com sucesso ao produto!',
      produto_id: produtoId,
      fornecedor_id: fornecedorId,
    };
  }

  /** Desassocia um fornecedor de um produto. */
  async desassociar(produtoId: number, fornecedorId: number): Promise<{ message: string }> {
    const associacao = await this.associacaoModel.findOne({
      where: { produto_id: produtoId, fornecedor_id: fornecedorId },
    });
    if (!associacao) {
      throw new NotFoundException(
        `Associação entre o produto ${produtoId} e o fornecedor ${fornecedorId} não encontrada.`,
      );
    }
    await associacao.destroy();
    return { message: 'Fornecedor desassociado com sucesso!' };
  }

  /** Lista os fornecedores associados a um produto. */
  async listarFornecedoresDoProduto(produtoId: number): Promise<Fornecedor[]> {
    const produto = await this.produtosService.findOne(produtoId);
    // `joinTableAttributes: []` omite as colunas da tabela de junção do resultado
    // (é válido em runtime para belongsToMany, mas não consta no tipo estreito de $get).
    return (await produto.$get('fornecedores', { joinTableAttributes: [] } as never)) as Fornecedor[];
  }

  /** Lista os produtos associados a um fornecedor. */
  async listarProdutosDoFornecedor(fornecedorId: number): Promise<Produto[]> {
    const fornecedor = await this.fornecedoresService.findOne(fornecedorId);
    return (await fornecedor.$get('produtos', { joinTableAttributes: [] } as never)) as Produto[];
  }
}
