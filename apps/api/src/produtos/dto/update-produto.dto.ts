import { PartialType } from '@nestjs/swagger';
import { CreateProdutoDto } from './create-produto.dto';

/**
 * Payload de atualização de um Produto.
 *
 * `PartialType` (do @nestjs/swagger) torna todos os campos do
 * {@link CreateProdutoDto} opcionais, preservando as regras de validação
 * (aplicadas apenas aos campos enviados) e a documentação `@ApiProperty`.
 */
export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {}
