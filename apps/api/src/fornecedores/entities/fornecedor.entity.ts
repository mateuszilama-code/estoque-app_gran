import { ApiProperty } from '@nestjs/swagger';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';

/**
 * Model do Fornecedor — mapeia a tabela `fornecedores` criada na Etapa 3
 * (migration `20260809120001-create-fornecedores`).
 *
 * - As colunas seguem o `snake_case` do schema versionado (o nome do atributo é
 *   igual ao nome da coluna).
 * - `@CreatedAt` / `@UpdatedAt` apontam os timestamps automáticos para as colunas
 *   `created_at` / `updated_at`, evitando os atributos camelCase padrão do Sequelize.
 * - Os `@ApiProperty` também documentam o schema de resposta na Swagger UI.
 */
@Table({ tableName: 'fornecedores' })
export class Fornecedor extends Model<
  InferAttributes<Fornecedor>,
  InferCreationAttributes<Fornecedor>
> {
  @ApiProperty({ example: 1, description: 'Identificador único do fornecedor.' })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @ApiProperty({ example: 'Tech Distribuidora LTDA', description: 'Razão social / nome da empresa.' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare nome_empresa: string;

  @ApiProperty({ example: '12.345.678/0001-90', description: 'CNPJ único, no formato 00.000.000/0000-00.' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare cnpj: string;

  @ApiProperty({ example: 'Rua das Palmeiras, 100 - São Paulo/SP', description: 'Endereço completo.' })
  @Column({ type: DataType.TEXT, allowNull: false })
  declare endereco: string;

  @ApiProperty({ example: '(11) 3333-4444', description: 'Telefone de contato.' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare telefone: string;

  @ApiProperty({ example: 'contato@techdistribuidora.com', description: 'E-mail de contato.' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare email: string;

  @ApiProperty({ example: 'Ana Souza', description: 'Nome do contato principal.' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare contato_principal: string;

  @ApiProperty({ example: '2026-08-09T12:00:00.000Z', description: 'Data de criação (automática).' })
  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  declare created_at: CreationOptional<Date>;

  @ApiProperty({ example: '2026-08-09T12:00:00.000Z', description: 'Data da última atualização (automática).' })
  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updated_at' })
  declare updated_at: CreationOptional<Date>;
}
