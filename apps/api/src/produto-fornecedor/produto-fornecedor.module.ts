import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FornecedoresModule } from '../fornecedores/fornecedores.module';
import { ProdutosModule } from '../produtos/produtos.module';
import { ProdutoFornecedor } from './entities/produto-fornecedor.entity';
import { ProdutoFornecedorController } from './produto-fornecedor.controller';
import { ProdutoFornecedorService } from './produto-fornecedor.service';

/**
 * Módulo da associação (N:N) entre Produto e Fornecedor.
 *
 * Registra o model de junção `ProdutoFornecedor` e reutiliza os services de
 * Produto e Fornecedor (exportados pelos respectivos módulos) para as validações
 * de existência. A relação `belongsToMany` é declarada nas entities Produto e
 * Fornecedor.
 */
@Module({
  imports: [
    SequelizeModule.forFeature([ProdutoFornecedor]),
    ProdutosModule,
    FornecedoresModule,
  ],
  controllers: [ProdutoFornecedorController],
  providers: [ProdutoFornecedorService],
})
export class ProdutoFornecedorModule {}
