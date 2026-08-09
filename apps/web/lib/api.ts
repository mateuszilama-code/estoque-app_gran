import type {
  CreateFornecedorInput,
  CreateProdutoInput,
  Fornecedor,
  MensagemResposta,
  Produto,
} from './types';

/** URL base da API — configurável por `NEXT_PUBLIC_API_URL` (ver `.env.example`). */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

/**
 * Erro de API já normalizado para exibição ao usuário.
 * - `message`: texto principal (mensagem do backend, alinhada ao PDF).
 * - `fieldErrors`: lista de mensagens por campo (validação 400), quando houver.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: string[];

  constructor(message: string, status: number, fieldErrors: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface NestErrorBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

async function parseError(response: Response): Promise<ApiError> {
  let body: NestErrorBody = {};
  try {
    body = (await response.json()) as NestErrorBody;
  } catch {
    // resposta sem corpo JSON
  }

  if (Array.isArray(body.message)) {
    // Erros de validação (400): uma mensagem por campo.
    return new ApiError(body.message[0] ?? 'Dados inválidos.', response.status, body.message);
  }
  const message =
    body.message ?? body.error ?? `Erro ${response.status} ao comunicar com a API.`;
  return new ApiError(message, response.status);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      ...init,
    });
  } catch {
    throw new ApiError('Não foi possível conectar à API. Verifique se o backend está no ar.', 0);
  }

  if (!response.ok) {
    throw await parseError(response);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

/** Client tipado da API, agrupado por recurso (espelha as tags da Swagger). */
export const api = {
  fornecedores: {
    list: () => request<Fornecedor[]>('/fornecedores'),
    get: (id: number) => request<Fornecedor>(`/fornecedores/${id}`),
    create: (data: CreateFornecedorInput) =>
      request<Fornecedor>('/fornecedores', { method: 'POST', body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`/fornecedores/${id}`, { method: 'DELETE' }),
    produtos: (fornecedorId: number) =>
      request<Produto[]>(`/fornecedores/${fornecedorId}/produtos`),
  },
  produtos: {
    list: () => request<Produto[]>('/produtos'),
    get: (id: number) => request<Produto>(`/produtos/${id}`),
    create: (data: CreateProdutoInput) =>
      request<Produto>('/produtos', { method: 'POST', body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`/produtos/${id}`, { method: 'DELETE' }),
  },
  associacao: {
    fornecedoresDoProduto: (produtoId: number) =>
      request<Fornecedor[]>(`/produtos/${produtoId}/fornecedores`),
    associar: (produtoId: number, fornecedorId: number) =>
      request<MensagemResposta & { produto_id: number; fornecedor_id: number }>(
        `/produtos/${produtoId}/fornecedores`,
        { method: 'POST', body: JSON.stringify({ fornecedor_id: fornecedorId }) },
      ),
    desassociar: (produtoId: number, fornecedorId: number) =>
      request<MensagemResposta>(`/produtos/${produtoId}/fornecedores/${fornecedorId}`, {
        method: 'DELETE',
      }),
  },
};
