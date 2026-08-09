import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { CategoriaProduto } from '../enums/categoria-produto.enum';

/** Código de barras numérico de 8 a 14 dígitos (EAN-8 a GTIN-14), quando informado. */
const CODIGO_BARRAS_REGEX = /^\d{8,14}$/;

/** Data no formato YYYY-MM-DD (coerente com a coluna DATEONLY). */
const DATA_VALIDADE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Payload de criação de um Produto.
 *
 * Obrigatórios: `nome`, `descricao`, `categoria`.
 * Opcionais: `codigo_barras` (único quando informado), `quantidade_estoque`
 * (padrão 0), `data_validade`, `imagem_url`.
 */
export class CreateProdutoDto {
  @ApiProperty({ example: 'Notebook 14"', description: 'Nome do produto.', maxLength: 150 })
  @IsString({ message: 'nome deve ser um texto.' })
  @IsNotEmpty({ message: 'nome é obrigatório.' })
  @MaxLength(150, { message: 'nome deve ter no máximo 150 caracteres.' })
  nome!: string;

  @ApiPropertyOptional({
    example: '7891000100001',
    description: 'Código de barras numérico (8 a 14 dígitos), único quando informado.',
  })
  @IsOptional()
  @IsString({ message: 'codigo_barras deve ser um texto.' })
  @Matches(CODIGO_BARRAS_REGEX, {
    message: 'codigo_barras deve conter de 8 a 14 dígitos numéricos.',
  })
  codigo_barras?: string;

  @ApiProperty({
    example: 'Notebook para uso corporativo, 16GB RAM.',
    description: 'Descrição do produto.',
  })
  @IsString({ message: 'descricao deve ser um texto.' })
  @IsNotEmpty({ message: 'descricao é obrigatória.' })
  descricao!: string;

  @ApiPropertyOptional({
    example: 15,
    description: 'Quantidade em estoque (inteiro ≥ 0). Padrão 0 quando omitido.',
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'quantidade_estoque deve ser um número inteiro.' })
  @Min(0, { message: 'quantidade_estoque não pode ser negativa.' })
  quantidade_estoque?: number;

  @ApiProperty({
    example: CategoriaProduto.ELETRONICOS,
    enum: CategoriaProduto,
    description: 'Categoria do produto (lista pré-definida).',
  })
  @IsEnum(CategoriaProduto, {
    message: 'categoria deve ser uma de: Eletrônicos, Alimentos, Vestuário, Outro.',
  })
  categoria!: CategoriaProduto;

  @ApiPropertyOptional({
    example: '2027-01-31',
    description: 'Data de validade no formato YYYY-MM-DD, quando aplicável.',
  })
  @IsOptional()
  @Matches(DATA_VALIDADE_REGEX, {
    message: 'data_validade deve estar no formato YYYY-MM-DD.',
  })
  data_validade?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.exemplo.com/produtos/notebook.png',
    description: 'URL/referência da imagem do produto, quando aplicável.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'imagem_url deve ser um texto.' })
  @MaxLength(500, { message: 'imagem_url deve ter no máximo 500 caracteres.' })
  imagem_url?: string;
}
