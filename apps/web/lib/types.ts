/**
 * Tipos compartilhados do domínio, espelhando o contrato da API (Swagger em /docs).
 * Em uma evolução futura, podem migrar para `packages/shared-types`.
 */

export interface Fornecedor {
  id: number;
  nome_empresa: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  contato_principal: string;
  created_at: string;
  updated_at: string;
}

export type CreateFornecedorInput = Omit<Fornecedor, 'id' | 'created_at' | 'updated_at'>;

/** Categorias pré-definidas do desafio (enum `categoria` do Produto). */
export const CATEGORIAS_PRODUTO = ['Eletrônicos', 'Alimentos', 'Vestuário', 'Outro'] as const;
export type CategoriaProduto = (typeof CATEGORIAS_PRODUTO)[number];

export interface Produto {
  id: number;
  nome: string;
  codigo_barras: string | null;
  descricao: string;
  quantidade_estoque: number;
  categoria: CategoriaProduto;
  data_validade: string | null;
  imagem_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProdutoInput {
  nome: string;
  codigo_barras?: string;
  descricao: string;
  quantidade_estoque?: number;
  categoria: CategoriaProduto;
  data_validade?: string;
  imagem_url?: string;
}

/** Resposta padrão dos endpoints de associação (mensagem ao usuário). */
export interface MensagemResposta {
  message: string;
}
