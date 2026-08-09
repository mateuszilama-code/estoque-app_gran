import { ApiProperty } from '@nestjs/swagger';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import { BelongsToMany, Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { Fornecedor } from '../../fornecedores/entities/fornecedor.entity';
import { ProdutoFornecedor } from '../../produto-fornecedor/entities/produto-fornecedor.entity';
import { CategoriaProduto } from '../enums/categoria-produto.enum';

/**
 * Model do Produto — mapeia a tabela `produtos` criada na Etapa 3
 * (migration `20260809120002-create-produtos`).
 *
 * - Nomes de atributos em `snake_case`, iguais às colunas.
 * - `codigo_barras` é único **quando informado** (o SQLite permite múltiplos NULL).
 * - `@CreatedAt` / `@UpdatedAt` apontam para as colunas `created_at` / `updated_at`,
 *   expondo apenas os timestamps `snake_case` na resposta JSON.
 * - Os `@ApiProperty` documentam o schema de resposta na Swagger UI.
 */
@Table({ tableName: 'produtos' })
export class Produto extends Model<
  InferAttributes<Produto>,
  InferCreationAttributes<Produto>
> {
  @ApiProperty({ example: 1, description: 'Identificador único do produto.' })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @ApiProperty({ example: 'Notebook 14"', description: 'Nome do produto.' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare nome: string;

  @ApiProperty({
    example: '7891000100001',
    description: 'Código de barras (único quando informado).',
    required: false,
    nullable: true,
  })
  @Column({ type: DataType.STRING, allowNull: true, unique: true })
  declare codigo_barras: CreationOptional<string | null>;

  @ApiProperty({ example: 'Notebook para uso corporativo, 16GB RAM.', description: 'Descrição do produto.' })
  @Column({ type: DataType.TEXT, allowNull: false })
  declare descricao: string;

  @ApiProperty({ example: 15, description: 'Quantidade disponível em estoque.', default: 0 })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare quantidade_estoque: CreationOptional<number>;

  @ApiProperty({
    example: CategoriaProduto.ELETRONICOS,
    enum: CategoriaProduto,
    description: 'Categoria do produto.',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  declare categoria: CategoriaProduto;

  @ApiProperty({
    example: '2027-01-31',
    description: 'Data de validade (YYYY-MM-DD), quando aplicável.',
    required: false,
    nullable: true,
  })
  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare data_validade: CreationOptional<string | null>;

  @ApiProperty({
    example: 'https://cdn.exemplo.com/produtos/notebook.png',
    description: 'URL/referência da imagem do produto, quando aplicável.',
    required: false,
    nullable: true,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  declare imagem_url: CreationOptional<string | null>;

  @ApiProperty({ example: '2026-08-09T12:00:00.000Z', description: 'Data de criação (automática).' })
  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  declare created_at: CreationOptional<Date>;

  @ApiProperty({ example: '2026-08-09T12:00:00.000Z', description: 'Data da última atualização (automática).' })
  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  declare updated_at: CreationOptional<Date>;

  /**
   * Fornecedores associados a este produto (relação N:N via `produto_fornecedores`).
   * Carregada sob demanda (ex.: `produto.$get('fornecedores')`); não faz parte do
   * schema de resposta padrão.
   */
  @BelongsToMany(() => Fornecedor, () => ProdutoFornecedor)
  declare fornecedores?: NonAttribute<Fornecedor[]>;
}
