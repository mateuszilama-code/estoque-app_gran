import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from './entities/produto.entity';
import { ProdutosService } from './produtos.service';

/**
 * Endpoints REST de Produto. Aparecem sob a tag "produtos" na Swagger UI
 * (`/docs`), com respostas documentadas para cada cenário do desafio
 * (sucesso, código de barras duplicado e erro de validação).
 */
@ApiTags('produtos')
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar produto',
    description:
      'Cria um produto. O código de barras (quando informado) deve ser único; um código já ' +
      'cadastrado retorna 409. Em caso de sucesso, o frontend exibe "Produto cadastrado com sucesso!".',
  })
  @ApiCreatedResponse({ description: 'Produto cadastrado com sucesso.', type: Produto })
  @ApiConflictResponse({
    description:
      'Código de barras já cadastrado — mensagem: "Produto com este código de barras já está cadastrado!".',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos — retorna as mensagens de erro por campo.',
  })
  create(@Body() createProdutoDto: CreateProdutoDto): Promise<Produto> {
    return this.produtosService.create(createProdutoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos' })
  @ApiOkResponse({ description: 'Lista de produtos.', type: [Produto] })
  findAll(): Promise<Produto[]> {
    return this.produtosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por id' })
  @ApiParam({ name: 'id', description: 'Identificador do produto', example: 1 })
  @ApiOkResponse({ description: 'Produto encontrado.', type: Produto })
  @ApiNotFoundResponse({ description: 'Produto não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar produto',
    description:
      'Atualiza os campos informados. Se o código de barras for alterado para um já existente, retorna 409.',
  })
  @ApiParam({ name: 'id', description: 'Identificador do produto', example: 1 })
  @ApiOkResponse({ description: 'Produto atualizado.', type: Produto })
  @ApiNotFoundResponse({ description: 'Produto não encontrado.' })
  @ApiConflictResponse({
    description:
      'Código de barras já cadastrado — mensagem: "Produto com este código de barras já está cadastrado!".',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos — retorna as mensagens de erro por campo.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    return this.produtosService.update(id, updateProdutoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover produto' })
  @ApiParam({ name: 'id', description: 'Identificador do produto', example: 1 })
  @ApiNoContentResponse({ description: 'Produto removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Produto não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.produtosService.remove(id);
  }
}
