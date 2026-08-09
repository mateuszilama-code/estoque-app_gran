import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { buildSequelizeOptions } from './config/database.config';
import { FornecedoresModule } from './fornecedores/fornecedores.module';
import { ProdutosModule } from './produtos/produtos.module';
import { ProdutoFornecedorModule } from './produto-fornecedor/produto-fornecedor.module';

@Module({
  imports: [
    // Configuração via variáveis de ambiente (.env), disponível em toda a aplicação.
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexão do Sequelize com o SQLite, montada a partir do ConfigService.
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => buildSequelizeOptions(config),
    }),

    // Módulos de domínio (feature-first).
    FornecedoresModule,
    ProdutosModule,
    ProdutoFornecedorModule,
  ],
})
export class AppModule {}
