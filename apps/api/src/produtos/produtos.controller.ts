import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProdutosService } from './produtos.service';

/**
 * Controller de Produto. As rotas CRUD serão adicionadas na Etapa 5 e
 * aparecerão sob a tag "produtos" na Swagger UI.
 */
@ApiTags('produtos')
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}
}
