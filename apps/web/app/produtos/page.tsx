'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  Button,
  Field,
  Input,
  Modal,
  Pagination,
  Select,
  Table,
  Textarea,
  useToast,
  type Column,
} from '@/components/ui';
import { ApiError, api } from '@/lib/api';
import { onlyDigits } from '@/lib/masks';
import { useListControls } from '@/lib/useListControls';
import { validarProduto, type ProdutoErrors, type ProdutoFormValues } from '@/lib/validators';
import { CATEGORIAS_PRODUTO, type CategoriaProduto, type CreateProdutoInput, type Produto } from '@/lib/types';

const FORM_VAZIO: ProdutoFormValues = {
  nome: '',
  codigo_barras: '',
  descricao: '',
  quantidade_estoque: '',
  categoria: '',
  data_validade: '',
  imagem_url: '',
};

const CHAVES: (keyof ProdutoFormValues)[] = [
  'nome',
  'codigo_barras',
  'descricao',
  'quantidade_estoque',
  'categoria',
  'data_validade',
  'imagem_url',
];

function mapearErrosApi(mensagens: string[]): ProdutoErrors {
  const erros: ProdutoErrors = {};
  for (const msg of mensagens) {
    const campo = CHAVES.find((c) => msg.startsWith(c));
    if (campo && !erros[campo]) erros[campo] = msg;
  }
  return erros;
}

export default function ProdutosPage() {
  const toast = useToast();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [erroCarregar, setErroCarregar] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState<ProdutoFormValues>(FORM_VAZIO);
  const [erros, setErros] = useState<ProdutoErrors>({});
  const [enviando, setEnviando] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErroCarregar(null);
    try {
      setProdutos(await api.produtos.list());
    } catch (e) {
      setErroCarregar(e instanceof ApiError ? e.message : 'Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const searchable = useCallback(
    (p: Produto) => `${p.nome} ${p.codigo_barras ?? ''} ${p.categoria}`,
    [],
  );
  const lista = useListControls(produtos, searchable);

  function abrirModal() {
    setForm(FORM_VAZIO);
    setErros({});
    setModalAberto(true);
  }

  function atualizar(campo: keyof ProdutoFormValues, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: undefined }));
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const errosClient = validarProduto(form);
    if (Object.keys(errosClient).length > 0) {
      setErros(errosClient);
      return;
    }

    setEnviando(true);
    setErros({});
    try {
      const payload: CreateProdutoInput = {
        nome: form.nome,
        descricao: form.descricao,
        categoria: form.categoria as CategoriaProduto,
      };
      if (form.codigo_barras.trim()) payload.codigo_barras = form.codigo_barras.trim();
      if (form.quantidade_estoque.trim()) payload.quantidade_estoque = Number(form.quantidade_estoque);
      if (form.data_validade) payload.data_validade = form.data_validade;
      if (form.imagem_url.trim()) payload.imagem_url = form.imagem_url.trim();

      await api.produtos.create(payload);
      toast.success('Produto cadastrado com sucesso!');
      setModalAberto(false);
      await carregar();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors.length > 0) {
        setErros(mapearErrosApi(err.fieldErrors));
      }
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível cadastrar.');
    } finally {
      setEnviando(false);
    }
  }

  async function remover(p: Produto) {
    if (!window.confirm(`Remover o produto "${p.nome}"?`)) return;
    try {
      await api.produtos.remove(p.id);
      toast.success('Produto removido com sucesso!');
      await carregar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível remover.');
    }
  }

  const columns: Column<Produto>[] = [
    { header: 'Produto', cell: (p) => <strong>{p.nome}</strong> },
    { header: 'Código de barras', cell: (p) => <span className="mono">{p.codigo_barras ?? '—'}</span> },
    { header: 'Categoria', cell: (p) => <span className="badge">{p.categoria}</span> },
    { header: 'Estoque', align: 'right', cell: (p) => p.quantidade_estoque },
    {
      header: 'Ações',
      align: 'right',
      cell: (p) => (
        <div className="table__actions">
          <Link href={`/produtos/${p.id}/fornecedores`} className="btn btn--secondary btn--sm">
            Fornecedores
          </Link>
          <Button variant="danger" size="sm" onClick={() => remover(p)}>
            Remover
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Produtos</h1>
          <p className="page-header__subtitle">
            Cadastro de produtos por categoria. Código de barras único quando informado.
          </p>
        </div>
        <Button onClick={abrirModal}>+ Novo produto</Button>
      </div>

      {loading ? (
        <div className="card state-msg">
          <span className="spinner" aria-hidden="true" /> Carregando…
        </div>
      ) : erroCarregar ? (
        <div className="card state-msg">
          {erroCarregar}
          <div style={{ marginTop: 12 }}>
            <Button variant="secondary" size="sm" onClick={() => void carregar()}>
              Tentar novamente
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="toolbar">
            <div className="toolbar__search">
              <Input
                type="search"
                aria-label="Buscar produtos"
                placeholder="Buscar por nome, código, categoria…"
                value={lista.query}
                onChange={(e) => lista.setQuery(e.target.value)}
              />
            </div>
            <span className="toolbar__count">
              {lista.total} {lista.total === 1 ? 'produto' : 'produtos'}
            </span>
          </div>

          <Table
            columns={columns}
            rows={lista.pageItems}
            keyField={(p) => p.id}
            emptyTitle={
              produtos.length === 0 ? 'Nenhum produto cadastrado' : 'Nenhum resultado para a busca'
            }
            emptyHint={produtos.length === 0 ? 'Clique em “Novo produto” para começar.' : undefined}
          />
          <Pagination page={lista.page} totalPages={lista.totalPages} onPage={lista.setPage} />
        </>
      )}

      <Modal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Novo produto"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAberto(false)} disabled={enviando}>
              Cancelar
            </Button>
            <Button type="submit" form="form-produto" loading={enviando}>
              Salvar
            </Button>
          </>
        }
      >
        <form id="form-produto" onSubmit={enviar} noValidate>
          <Field label="Nome" htmlFor="nome" required error={erros.nome}>
            <Input
              id="nome"
              placeholder='Notebook 14"'
              value={form.nome}
              invalid={Boolean(erros.nome)}
              onChange={(e) => atualizar('nome', e.target.value)}
            />
          </Field>

          <Field label="Descrição" htmlFor="descricao" required error={erros.descricao}>
            <Textarea
              id="descricao"
              placeholder="Breve descrição do produto"
              value={form.descricao}
              invalid={Boolean(erros.descricao)}
              onChange={(e) => atualizar('descricao', e.target.value)}
            />
          </Field>

          <div className="grid-2">
            <Field label="Categoria" htmlFor="categoria" required error={erros.categoria}>
              <Select
                id="categoria"
                placeholder="Selecione…"
                value={form.categoria}
                invalid={Boolean(erros.categoria)}
                options={CATEGORIAS_PRODUTO.map((c) => ({ value: c, label: c }))}
                onChange={(e) => atualizar('categoria', e.target.value)}
              />
            </Field>

            <Field
              label="Quantidade em estoque"
              htmlFor="quantidade_estoque"
              error={erros.quantidade_estoque}
              hint="Opcional — padrão 0"
            >
              <Input
                id="quantidade_estoque"
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="0"
                value={form.quantidade_estoque}
                invalid={Boolean(erros.quantidade_estoque)}
                onChange={(e) => atualizar('quantidade_estoque', e.target.value)}
              />
            </Field>
          </div>

          <div className="grid-2">
            <Field
              label="Código de barras"
              htmlFor="codigo_barras"
              error={erros.codigo_barras}
              hint="Opcional — 8 a 14 dígitos"
            >
              <Input
                id="codigo_barras"
                inputMode="numeric"
                placeholder="7891000100001"
                value={form.codigo_barras}
                invalid={Boolean(erros.codigo_barras)}
                onChange={(e) => atualizar('codigo_barras', onlyDigits(e.target.value).slice(0, 14))}
              />
            </Field>

            <Field label="Data de validade" htmlFor="data_validade" error={erros.data_validade} hint="Opcional">
              <Input
                id="data_validade"
                type="date"
                value={form.data_validade}
                invalid={Boolean(erros.data_validade)}
                onChange={(e) => atualizar('data_validade', e.target.value)}
              />
            </Field>
          </div>

          <Field label="Imagem (URL)" htmlFor="imagem_url" error={erros.imagem_url} hint="Opcional">
            <Input
              id="imagem_url"
              placeholder="https://…"
              value={form.imagem_url}
              invalid={Boolean(erros.imagem_url)}
              onChange={(e) => atualizar('imagem_url', e.target.value)}
            />
          </Field>
        </form>
      </Modal>
    </>
  );
}
