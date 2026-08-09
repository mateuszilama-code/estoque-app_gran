import { ApiProperty } from '@nestjs/swagger';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { Fornecedor } from '../../fornecedores/entities/fornecedor.entity';
import { Produto } from '../../produtos/entities/produto.entity';

/**
 * Model de junção da relação N:N entre Produto e Fornecedor — mapeia a tabela
 * `produto_fornecedores` (migration `20260809120003-create-produto-fornecedores`).
 *
 * O par (`produto_id`, `fornecedor_id`) é único (índice `uq_produto_fornecedor`),
 * base do cenário "Fornecedor já está associado a este produto!". As FKs usam
 * ON DELETE/UPDATE CASCADE (definido na migration).
 */
@Table({ tableName: 'produto_fornecedores' })
export class ProdutoFornecedor extends Model<
  InferAttributes<ProdutoFornecedor>,
  InferCreationAttributes<ProdutoFornecedor>
> {
  @ApiProperty({ example: 1, description: 'Identificador único da associação.' })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @ApiProperty({ example: 1, description: 'FK do produto associado.' })
  @ForeignKey(() => Produto)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'produto_id' })
  declare produto_id: number;

  @ApiProperty({ example: 1, description: 'FK do fornecedor associado.' })
  @ForeignKey(() => Fornecedor)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'fornecedor_id' })
  declare fornecedor_id: number;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  declare created_at: CreationOptional<Date>;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  declare updated_at: CreationOptional<Date>;
}
