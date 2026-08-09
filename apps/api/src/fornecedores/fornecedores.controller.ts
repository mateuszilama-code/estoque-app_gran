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
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';
import { Fornecedor } from './entities/fornecedor.entity';
import { FornecedoresService } from './fornecedores.service';

/**
 * Endpoints REST de Fornecedor. Aparecem sob a tag "fornecedores" na Swagger UI
 * (`/docs`), com respostas documentadas para cada cenário do desafio
 * (sucesso, CNPJ duplicado e erro de validação).
 */
@ApiTags('fornecedores')
@Controller('fornecedores')
export class FornecedoresController {
  constructor(private readonly fornecedoresService: FornecedoresService) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar fornecedor',
    description:
      'Cria um fornecedor. O CNPJ deve ser único; um CNPJ já cadastrado retorna 409. ' +
      'Em caso de sucesso, o frontend exibe "Fornecedor cadastrado com sucesso!".',
  })
  @ApiCreatedResponse({ description: 'Fornecedor cadastrado com sucesso.', type: Fornecedor })
  @ApiConflictResponse({
    description: 'CNPJ já cadastrado — mensagem: "Fornecedor com esse CNPJ já está cadastrado!".',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos — retorna as mensagens de erro por campo.',
  })
  create(@Body() createFornecedorDto: CreateFornecedorDto): Promise<Fornecedor> {
    return this.fornecedoresService.create(createFornecedorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar fornecedores' })
  @ApiOkResponse({ description: 'Lista de fornecedores.', type: [Fornecedor] })
  findAll(): Promise<Fornecedor[]> {
    return this.fornecedoresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fornecedor por id' })
  @ApiParam({ name: 'id', description: 'Identificador do fornecedor', example: 1 })
  @ApiOkResponse({ description: 'Fornecedor encontrado.', type: Fornecedor })
  @ApiNotFoundResponse({ description: 'Fornecedor não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Fornecedor> {
    return this.fornecedoresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar fornecedor',
    description:
      'Atualiza os campos informados. Se o CNPJ for alterado para um já existente, retorna 409.',
  })
  @ApiParam({ name: 'id', description: 'Identificador do fornecedor', example: 1 })
  @ApiOkResponse({ description: 'Fornecedor atualizado.', type: Fornecedor })
  @ApiNotFoundResponse({ description: 'Fornecedor não encontrado.' })
  @ApiConflictResponse({
    description: 'CNPJ já cadastrado — mensagem: "Fornecedor com esse CNPJ já está cadastrado!".',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos — retorna as mensagens de erro por campo.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFornecedorDto: UpdateFornecedorDto,
  ): Promise<Fornecedor> {
    return this.fornecedoresService.update(id, updateFornecedorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover fornecedor' })
  @ApiParam({ name: 'id', description: 'Identificador do fornecedor', example: 1 })
  @ApiNoContentResponse({ description: 'Fornecedor removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Fornecedor não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.fornecedoresService.remove(id);
  }
}
