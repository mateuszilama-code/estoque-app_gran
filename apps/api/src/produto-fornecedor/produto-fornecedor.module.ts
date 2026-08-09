import { Module } from '@nestjs/common';
import { ProdutoFornecedorController } from './produto-fornecedor.controller';
import { ProdutoFornecedorService } from './produto-fornecedor.service';

/**
 * Módulo da associação (muitos-para-muitos) entre Produto e Fornecedor.
 * A relação belongsToMany e os endpoints de associar/desassociar/listar
 * serão implementados na Etapa 6.
 */
@Module({
  controllers: [ProdutoFornecedorController],
  providers: [ProdutoFornecedorService],
})
export class ProdutoFornecedorModule {}
