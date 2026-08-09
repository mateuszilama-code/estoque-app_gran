import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProdutoFornecedorService } from './produto-fornecedor.service';

/**
 * Controller da associação Produto/Fornecedor. Os endpoints (associar,
 * desassociar e listar) serão adicionados na Etapa 6 e aparecerão sob a
 * tag "associacao" na Swagger UI.
 */
@ApiTags('associacao')
@Controller()
export class ProdutoFornecedorController {
  constructor(private readonly produtoFornecedorService: ProdutoFornecedorService) {}
}
