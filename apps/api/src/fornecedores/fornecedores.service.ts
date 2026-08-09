import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';
import { Fornecedor } from './entities/fornecedor.entity';

/**
 * Regras de negócio de Fornecedor.
 *
 * Regra central: o CNPJ é único no sistema. Ao criar (ou ao alterar o CNPJ),
 * um CNPJ já existente resulta em `409 Conflict` com a mensagem exigida pelo
 * desafio: "Fornecedor com esse CNPJ já está cadastrado!".
 */
@Injectable()
export class FornecedoresService {
  constructor(
    @InjectModel(Fornecedor)
    private readonly fornecedorModel: typeof Fornecedor,
  ) {}

  /** Cria um fornecedor, garantindo que o CNPJ seja inédito. */
  async create(dto: CreateFornecedorDto): Promise<Fornecedor> {
    await this.assertCnpjInedito(dto.cnpj);
    return this.fornecedorModel.create(dto as CreationAttributes<Fornecedor>);
  }

  /** Lista todos os fornecedores (ordenados por nome da empresa). */
  findAll(): Promise<Fornecedor[]> {
    return this.fornecedorModel.findAll({ order: [['nome_empresa', 'ASC']] });
  }

  /** Busca um fornecedor por id; lança 404 quando não existe. */
  async findOne(id: number): Promise<Fornecedor> {
    const fornecedor = await this.fornecedorModel.findByPk(id);
    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor com id ${id} não encontrado.`);
    }
    return fornecedor;
  }

  /**
   * Atualiza um fornecedor. Se o CNPJ for alterado, valida novamente a
   * unicidade (evita colidir com o CNPJ de outro fornecedor).
   */
  async update(id: number, dto: UpdateFornecedorDto): Promise<Fornecedor> {
    const fornecedor = await this.findOne(id);
    if (dto.cnpj && dto.cnpj !== fornecedor.cnpj) {
      await this.assertCnpjInedito(dto.cnpj);
    }
    return fornecedor.update(dto);
  }

  /** Remove um fornecedor por id; lança 404 quando não existe. */
  async remove(id: number): Promise<void> {
    const fornecedor = await this.findOne(id);
    await fornecedor.destroy();
  }

  /** Lança 409 se já existir um fornecedor com o CNPJ informado. */
  private async assertCnpjInedito(cnpj: string): Promise<void> {
    const existente = await this.fornecedorModel.findOne({ where: { cnpj } });
    if (existente) {
      throw new ConflictException('Fornecedor com esse CNPJ já está cadastrado!');
    }
  }
}
