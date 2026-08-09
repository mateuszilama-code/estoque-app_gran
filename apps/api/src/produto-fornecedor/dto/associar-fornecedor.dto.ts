import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

/**
 * Corpo do POST de associação: identifica o fornecedor a associar ao produto
 * indicado na rota (`/produtos/:produtoId/fornecedores`).
 */
export class AssociarFornecedorDto {
  @ApiProperty({ example: 1, description: 'Id do fornecedor a associar ao produto.' })
  @Type(() => Number)
  @IsInt({ message: 'fornecedor_id deve ser um número inteiro.' })
  @Min(1, { message: 'fornecedor_id deve ser um inteiro positivo.' })
  fornecedor_id!: number;
}
