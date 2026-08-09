import { Module } from '@nestjs/common';
import { FornecedoresController } from './fornecedores.controller';
import { FornecedoresService } from './fornecedores.service';

/**
 * Módulo de Fornecedor. O CRUD, DTOs (com validação) e a entity serão
 * implementados na Etapa 4.
 */
@Module({
  controllers: [FornecedoresController],
  providers: [FornecedoresService],
})
export class FornecedoresModule {}
