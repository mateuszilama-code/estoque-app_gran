import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

/**
 * Formato de CNPJ exigido: `00.000.000/0000-00` (com pontuação).
 * Base do cenário de erro "Fornecedor com esse CNPJ já está cadastrado!".
 */
const CNPJ_REGEX = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

/**
 * Formato de telefone aceito: `(00) 0000-0000` ou `(00) 00000-0000` (celular).
 */
const TELEFONE_REGEX = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;

/**
 * Payload de criação de um Fornecedor. Todos os campos são obrigatórios.
 * As mensagens de validação são retornadas por campo (HTTP 400) pelo
 * ValidationPipe global.
 */
export class CreateFornecedorDto {
  @ApiProperty({
    example: 'Tech Distribuidora LTDA',
    description: 'Razão social / nome da empresa.',
    maxLength: 150,
  })
  @IsString({ message: 'nome_empresa deve ser um texto.' })
  @IsNotEmpty({ message: 'nome_empresa é obrigatório.' })
  @MaxLength(150, { message: 'nome_empresa deve ter no máximo 150 caracteres.' })
  nome_empresa!: string;

  @ApiProperty({
    example: '12.345.678/0001-90',
    description: 'CNPJ único, no formato 00.000.000/0000-00.',
  })
  @IsString({ message: 'cnpj deve ser um texto.' })
  @IsNotEmpty({ message: 'cnpj é obrigatório.' })
  @Matches(CNPJ_REGEX, { message: 'cnpj deve estar no formato 00.000.000/0000-00.' })
  cnpj!: string;

  @ApiProperty({
    example: 'Rua das Palmeiras, 100 - São Paulo/SP',
    description: 'Endereço completo do fornecedor.',
  })
  @IsString({ message: 'endereco deve ser um texto.' })
  @IsNotEmpty({ message: 'endereco é obrigatório.' })
  endereco!: string;

  @ApiProperty({
    example: '(11) 3333-4444',
    description: 'Telefone no formato (00) 0000-0000 ou (00) 00000-0000.',
  })
  @IsString({ message: 'telefone deve ser um texto.' })
  @IsNotEmpty({ message: 'telefone é obrigatório.' })
  @Matches(TELEFONE_REGEX, {
    message: 'telefone deve estar no formato (00) 0000-0000 ou (00) 00000-0000.',
  })
  telefone!: string;

  @ApiProperty({
    example: 'contato@techdistribuidora.com',
    description: 'E-mail de contato válido.',
  })
  @IsNotEmpty({ message: 'email é obrigatório.' })
  @IsEmail({}, { message: 'email deve ser um endereço de e-mail válido.' })
  email!: string;

  @ApiProperty({
    example: 'Ana Souza',
    description: 'Nome do contato principal no fornecedor.',
    maxLength: 120,
  })
  @IsString({ message: 'contato_principal deve ser um texto.' })
  @IsNotEmpty({ message: 'contato_principal é obrigatório.' })
  @MaxLength(120, { message: 'contato_principal deve ter no máximo 120 caracteres.' })
  contato_principal!: string;
}
