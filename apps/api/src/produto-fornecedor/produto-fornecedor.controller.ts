import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Fornecedor } from '../fornecedores/entities/fornecedor.entity';
import { Produto } from '../produtos/entities/produto.entity';
import { AssociarFornecedorDto } from './dto/associar-fornecedor.dto';
import { ProdutoFornecedorService } from './produto-fornecedor.service';

/**
 * Endpoints da associação (N:N) entre Produto e Fornecedor. Aparecem sob a tag
 * "associacao" na Swagger UI (`/docs`), cobrindo os cenários do desafio:
 * associar, associação duplicada e desassociar.
 */
@ApiTags('associacao')
@Controller()
export class ProdutoFornecedorController {
  constructor(private readonly produtoFornecedorService: ProdutoFornecedorService) {}

  @Post('produtos/:produtoId/fornecedores')
  @ApiOperation({
    summary: 'Associar fornecedor a um produto',
    description:
      'Associa um fornecedor (informado no corpo) ao produto da rota. Um par já existente ' +
      'retorna 409. Em caso de sucesso, o frontend exibe "Fornecedor associado com sucesso ao produto!".',
  })
  @ApiParam({ name: 'produtoId', description: 'Id do produto', example: 1 })
  @ApiCreatedResponse({
    description: 'Fornecedor associado com sucesso.',
    schema: {
      example: {
        message: 'Fornecedor associado com sucesso ao produto!',
        produto_id: 1,
        fornecedor_id: 1,
      },
    },
  })
  @ApiConflictResponse({
    description:
      'Associação já existente — mensagem: "Fornecedor já está associado a este produto!".',
  })
  @ApiNotFoundResponse({ description: 'Produto ou fornecedor não encontrado.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos — retorna as mensagens de erro por campo.' })
  associar(
    @Param('produtoId', ParseIntPipe) produtoId: number,
    @Body() dto: AssociarFornecedorDto,
  ) {
    return this.produtoFornecedorService.associar(produtoId, dto.fornecedor_id);
  }

  @Delete('produtos/:produtoId/fornecedores/:fornecedorId')
  @ApiOperation({
    summary: 'Desassociar fornecedor de um produto',
    description:
      'Remove a associação entre o produto e o fornecedor. Em caso de sucesso, o frontend ' +
      'exibe "Fornecedor desassociado com sucesso!".',
  })
  @ApiParam({ name: 'produtoId', description: 'Id do produto', example: 1 })
  @ApiParam({ name: 'fornecedorId', description: 'Id do fornecedor', example: 1 })
  @ApiOkResponse({
    description: 'Fornecedor desassociado com sucesso.',
    schema: { example: { message: 'Fornecedor desassociado com sucesso!' } },
  })
  @ApiNotFoundResponse({ description: 'Associação não encontrada entre este produto e fornecedor.' })
  desassociar(
    @Param('produtoId', ParseIntPipe) produtoId: number,
    @Param('fornecedorId', ParseIntPipe) fornecedorId: number,
  ) {
    return this.produtoFornecedorService.desassociar(produtoId, fornecedorId);
  }

  @Get('produtos/:produtoId/fornecedores')
  @ApiOperation({ summary: 'Listar fornecedores de um produto' })
  @ApiParam({ name: 'produtoId', description: 'Id do produto', example: 1 })
  @ApiOkResponse({ description: 'Fornecedores associados ao produto.', type: [Fornecedor] })
  @ApiNotFoundResponse({ description: 'Produto não encontrado.' })
  listarFornecedoresDoProduto(
    @Param('produtoId', ParseIntPipe) produtoId: number,
  ): Promise<Fornecedor[]> {
    return this.produtoFornecedorService.listarFornecedoresDoProduto(produtoId);
  }

  @Get('fornecedores/:fornecedorId/produtos')
  @ApiOperation({ summary: 'Listar produtos de um fornecedor' })
  @ApiParam({ name: 'fornecedorId', description: 'Id do fornecedor', example: 1 })
  @ApiOkResponse({ description: 'Produtos associados ao fornecedor.', type: [Produto] })
  @ApiNotFoundResponse({ description: 'Fornecedor não encontrado.' })
  listarProdutosDoFornecedor(
    @Param('fornecedorId', ParseIntPipe) fornecedorId: number,
  ): Promise<Produto[]> {
    return this.produtoFornecedorService.listarProdutosDoFornecedor(fornecedorId);
  }
}
