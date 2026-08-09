import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Produto } from './entities/produto.entity';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';

/**
 * Módulo de Produto: registra o model `Produto` (SequelizeModule.forFeature)
 * e expõe o CRUD via controller/service. O service é exportado para reuso pelo
 * módulo de Associação (Etapa 6).
 */
@Module({
  imports: [SequelizeModule.forFeature([Produto])],
  controllers: [ProdutosController],
  providers: [ProdutosService],
  exports: [ProdutosService],
})
export class ProdutosModule {}
