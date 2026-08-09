import { Module } from '@nestjs/common';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';

/**
 * Módulo de Produto. O CRUD, DTOs (com validação) e a entity serão
 * implementados na Etapa 5.
 */
@Module({
  controllers: [ProdutosController],
  providers: [ProdutosService],
})
export class ProdutosModule {}
