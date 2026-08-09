import { PartialType } from '@nestjs/swagger';
import { CreateFornecedorDto } from './create-fornecedor.dto';

/**
 * Payload de atualização de um Fornecedor.
 *
 * `PartialType` (do @nestjs/swagger) torna todos os campos do
 * {@link CreateFornecedorDto} opcionais, preservando as regras de validação
 * (aplicadas apenas aos campos enviados) e a documentação `@ApiProperty`.
 */
export class UpdateFornecedorDto extends PartialType(CreateFornecedorDto) {}
