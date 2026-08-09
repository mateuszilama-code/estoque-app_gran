import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Fornecedor } from './entities/fornecedor.entity';
import { FornecedoresController } from './fornecedores.controller';
import { FornecedoresService } from './fornecedores.service';

/**
 * Módulo de Fornecedor: registra o model `Fornecedor` (SequelizeModule.forFeature)
 * e expõe o CRUD via controller/service. O service é exportado para reuso pelo
 * módulo de Associação (Etapa 6).
 */
@Module({
  imports: [SequelizeModule.forFeature([Fornecedor])],
  controllers: [FornecedoresController],
  providers: [FornecedoresService],
  exports: [FornecedoresService],
})
export class FornecedoresModule {}
