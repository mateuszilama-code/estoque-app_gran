import type { CreateFornecedorInput } from './types';
import { CATEGORIAS_PRODUTO } from './types';

/**
 * Validação client-side que **espelha as regras do backend** (mesmos formatos e
 * mensagens). Roda antes do envio para dar feedback imediato; o backend continua
 * sendo a fonte da verdade (validação server-side).
 */

const CNPJ_RE = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const TELEFONE_RE = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODIGO_BARRAS_RE = /^\d{8,14}$/;
const DATA_RE = /^\d{4}-\d{2}-\d{2}$/;

export type FornecedorErrors = Partial<Record<keyof CreateFornecedorInput, string>>;

export function validarFornecedor(f: CreateFornecedorInput): FornecedorErrors {
  const e: FornecedorErrors = {};

  if (!f.nome_empresa.trim()) e.nome_empresa = 'nome_empresa é obrigatório.';
  else if (f.nome_empresa.length > 150)
    e.nome_empresa = 'nome_empresa deve ter no máximo 150 caracteres.';

  if (!f.cnpj.trim()) e.cnpj = 'cnpj é obrigatório.';
  else if (!CNPJ_RE.test(f.cnpj)) e.cnpj = 'cnpj deve estar no formato 00.000.000/0000-00.';

  if (!f.endereco.trim()) e.endereco = 'endereco é obrigatório.';

  if (!f.telefone.trim()) e.telefone = 'telefone é obrigatório.';
  else if (!TELEFONE_RE.test(f.telefone))
    e.telefone = 'telefone deve estar no formato (00) 0000-0000 ou (00) 00000-0000.';

  if (!f.email.trim()) e.email = 'email é obrigatório.';
  else if (!EMAIL_RE.test(f.email)) e.email = 'email deve ser um endereço de e-mail válido.';

  if (!f.contato_principal.trim()) e.contato_principal = 'contato_principal é obrigatório.';
  else if (f.contato_principal.length > 120)
    e.contato_principal = 'contato_principal deve ter no máximo 120 caracteres.';

  return e;
}

/** Campos do formulário de Produto (todos como string, no estado do form). */
export interface ProdutoFormValues {
  nome: string;
  codigo_barras: string;
  descricao: string;
  quantidade_estoque: string;
  categoria: string;
  data_validade: string;
  imagem_url: string;
}

export type ProdutoErrors = Partial<Record<keyof ProdutoFormValues, string>>;

export function validarProduto(f: ProdutoFormValues): ProdutoErrors {
  const e: ProdutoErrors = {};

  if (!f.nome.trim()) e.nome = 'nome é obrigatório.';
  else if (f.nome.length > 150) e.nome = 'nome deve ter no máximo 150 caracteres.';

  if (!f.descricao.trim()) e.descricao = 'descricao é obrigatória.';

  if (!f.categoria || !CATEGORIAS_PRODUTO.includes(f.categoria as (typeof CATEGORIAS_PRODUTO)[number]))
    e.categoria = 'categoria deve ser uma de: Eletrônicos, Alimentos, Vestuário, Outro.';

  if (f.codigo_barras.trim() && !CODIGO_BARRAS_RE.test(f.codigo_barras.trim()))
    e.codigo_barras = 'codigo_barras deve conter de 8 a 14 dígitos numéricos.';

  if (f.quantidade_estoque.trim()) {
    const n = Number(f.quantidade_estoque);
    if (!Number.isInteger(n)) e.quantidade_estoque = 'quantidade_estoque deve ser um número inteiro.';
    else if (n < 0) e.quantidade_estoque = 'quantidade_estoque não pode ser negativa.';
  }

  if (f.data_validade.trim() && !DATA_RE.test(f.data_validade.trim()))
    e.data_validade = 'data_validade deve estar no formato YYYY-MM-DD.';

  if (f.imagem_url.length > 500) e.imagem_url = 'imagem_url deve ter no máximo 500 caracteres.';

  return e;
}
