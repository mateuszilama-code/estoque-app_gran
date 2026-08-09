import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from './entities/produto.entity';

/**
 * Regras de negócio de Produto.
 *
 * Regra central: o código de barras, **quando informado**, é único no sistema.
 * Um código já existente resulta em `409 Conflict` com a mensagem exigida pelo
 * desafio: "Produto com este código de barras já está cadastrado!".
 */
@Injectable()
export class ProdutosService {
  constructor(
    @InjectModel(Produto)
    private readonly produtoModel: typeof Produto,
  ) {}

  /** Cria um produto, garantindo o código de barras único quando informado. */
  async create(dto: CreateProdutoDto): Promise<Produto> {
    if (dto.codigo_barras) {
      await this.assertCodigoBarrasInedito(dto.codigo_barras);
    }
    return this.produtoModel.create(dto as CreationAttributes<Produto>);
  }

  /** Lista todos os produtos (ordenados por nome). */
  findAll(): Promise<Produto[]> {
    return this.produtoModel.findAll({ order: [['nome', 'ASC']] });
  }

  /** Busca um produto por id; lança 404 quando não existe. */
  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoModel.findByPk(id);
    if (!produto) {
      throw new NotFoundException(`Produto com id ${id} não encontrado.`);
    }
    return produto;
  }

  /**
   * Atualiza um produto. Se o código de barras for alterado, valida novamente a
   * unicidade (evita colidir com o código de outro produto).
   */
  async update(id: number, dto: UpdateProdutoDto): Promise<Produto> {
    const produto = await this.findOne(id);
    if (dto.codigo_barras && dto.codigo_barras !== produto.codigo_barras) {
      await this.assertCodigoBarrasInedito(dto.codigo_barras);
    }
    return produto.update(dto);
  }

  /** Remove um produto por id; lança 404 quando não existe. */
  async remove(id: number): Promise<void> {
    const produto = await this.findOne(id);
    await produto.destroy();
  }

  /** Lança 409 se já existir um produto com o código de barras informado. */
  private async assertCodigoBarrasInedito(codigoBarras: string): Promise<void> {
    const existente = await this.produtoModel.findOne({
      where: { codigo_barras: codigoBarras },
    });
    if (existente) {
      throw new ConflictException('Produto com este código de barras já está cadastrado!');
    }
  }
}
