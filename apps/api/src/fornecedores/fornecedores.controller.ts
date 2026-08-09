import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FornecedoresService } from './fornecedores.service';

/**
 * Controller de Fornecedor. As rotas CRUD serão adicionadas na Etapa 4 e
 * aparecerão sob a tag "fornecedores" na Swagger UI.
 */
@ApiTags('fornecedores')
@Controller('fornecedores')
export class FornecedoresController {
  constructor(private readonly fornecedoresService: FornecedoresService) {}
}
