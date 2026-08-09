'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Select, Table, useToast, type Column } from '@/components/ui';
import { ApiError, api } from '@/lib/api';
import type { Fornecedor, Produto } from '@/lib/types';

/** Item de uma lista de descrição (rótulo + valor) para os detalhes read-only. */
function DetalheItem({ termo, children }: { termo: string; children: ReactNode }) {
  return (
    <div className="dl__item">
      <span className="dl__term">{termo}</span>
      <span className="dl__desc">{children}</span>
    </div>
  );
}

export default function ProdutoFornecedoresPage() {
  const params = useParams<{ id: string }>();
  const produtoId = Number(params.id);
  const toast = useToast();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [associados, setAssociados] = useState<Fornecedor[]>([]);
  const [todos, setTodos] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [erroCarregar, setErroCarregar] = useState<string | null>(null);

  const [selecionado, setSelecionado] = useState('');
  const [associando, setAssociando] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErroCarregar(null);
    try {
      const [prod, assoc, all] = await Promise.all([
        api.produtos.get(produtoId),
        api.associacao.fornecedoresDoProduto(produtoId),
        api.fornecedores.list(),
      ]);
      setProduto(prod);
      setAssociados(assoc);
      setTodos(all);
    } catch (e) {
      setErroCarregar(e instanceof ApiError ? e.message : 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, [produtoId]);

  useEffect(() => {
    if (Number.isNaN(produtoId)) {
      setErroCarregar('Produto inválido.');
      setLoading(false);
      return;
    }
    void carregar();
  }, [carregar, produtoId]);

  const disponiveis = useMemo(() => {
    const idsAssociados = new Set(associados.map((f) => f.id));
    return todos.filter((f) => !idsAssociados.has(f.id));
  }, [associados, todos]);

  async function associar() {
    if (!selecionado) return;
    setAssociando(true);
    try {
      const resp = await api.associacao.associar(produtoId, Number(selecionado));
      toast.success(resp.message);
      setSelecionado('');
      await carregar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível associar.');
    } finally {
      setAssociando(false);
    }
  }

  async function desassociar(f: Fornecedor) {
    if (!window.confirm(`Desassociar "${f.nome_empresa}" deste produto?`)) return;
    try {
      const resp = await api.associacao.desassociar(produtoId, f.id);
      toast.success(resp.message);
      await carregar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível desassociar.');
    }
  }

  const columns: Column<Fornecedor>[] = [
    { header: 'Empresa', cell: (f) => <strong>{f.nome_empresa}</strong> },
    { header: 'CNPJ', cell: (f) => <span className="mono">{f.cnpj}</span> },
    { header: 'Contato', cell: (f) => f.contato_principal },
    { header: 'Telefone', cell: (f) => f.telefone },
    {
      header: 'Ações',
      align: 'right',
      cell: (f) => (
        <div className="table__actions">
          <Button variant="danger" size="sm" onClick={() => desassociar(f)}>
            Desassociar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-header__subtitle" style={{ marginBottom: 4 }}>
            <Link href="/produtos">← Produtos</Link>
          </p>
          <h1 className="page-header__title">Fornecedores {produto ? `de ${produto.nome}` : ''}</h1>
          <p className="page-header__subtitle">
            Associe ou desassocie fornecedores deste produto (relação muitos-para-muitos).
          </p>
        </div>
      </div>

      {loading ? (
        <div className="card state-msg">
          <span className="spinner" aria-hidden="true" /> Carregando…
        </div>
      ) : erroCarregar ? (
        <div className="card state-msg">
          {erroCarregar}
          <div style={{ marginTop: 12 }}>
            <Link href="/produtos" className="btn btn--secondary btn--sm">
              Voltar aos produtos
            </Link>
          </div>
        </div>
      ) : (
        <div className="stack">
          {produto && (
            <div className="card card--pad">
              <h2 style={{ fontSize: 'var(--fs-md)', marginBottom: 16 }}>Detalhes do produto</h2>
              <div className="dl">
                <DetalheItem termo="Nome">{produto.nome}</DetalheItem>
                <DetalheItem termo="Categoria">
                  <span className="badge">{produto.categoria}</span>
                </DetalheItem>
                <DetalheItem termo="Código de barras">
                  <span className="mono">{produto.codigo_barras ?? '—'}</span>
                </DetalheItem>
                <DetalheItem termo="Estoque">{produto.quantidade_estoque}</DetalheItem>
                <DetalheItem termo="Validade">{produto.data_validade ?? '—'}</DetalheItem>
                <DetalheItem termo="Descrição">{produto.descricao}</DetalheItem>
              </div>
            </div>
          )}

          <div className="card card--pad">
            <h2 style={{ fontSize: 'var(--fs-md)', marginBottom: 12 }}>Associar fornecedor</h2>
            <div className="row" style={{ alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 260px' }}>
                <Select
                  aria-label="Selecionar fornecedor"
                  placeholder={disponiveis.length ? 'Selecione um fornecedor…' : 'Nenhum disponível'}
                  value={selecionado}
                  disabled={disponiveis.length === 0}
                  options={disponiveis.map((f) => ({ value: String(f.id), label: f.nome_empresa }))}
                  onChange={(e) => setSelecionado(e.target.value)}
                />
              </div>
              <Button onClick={associar} disabled={!selecionado} loading={associando}>
                Associar fornecedor
              </Button>
            </div>
            {disponiveis.length === 0 && todos.length > 0 && (
              <p className="field__hint" style={{ marginTop: 8 }}>
                Todos os fornecedores já estão associados a este produto.
              </p>
            )}
            {todos.length === 0 && (
              <p className="field__hint" style={{ marginTop: 8 }}>
                Nenhum fornecedor cadastrado. Cadastre um em{' '}
                <Link href="/fornecedores">Fornecedores</Link>.
              </p>
            )}
          </div>

          <div>
            <h2 style={{ fontSize: 'var(--fs-md)', marginBottom: 12 }}>
              Fornecedores associados ({associados.length})
            </h2>
            <Table
              columns={columns}
              rows={associados}
              keyField={(f) => f.id}
              emptyTitle="Nenhum fornecedor associado"
              emptyHint="Use o seletor acima para associar um fornecedor."
            />
          </div>
        </div>
      )}
    </>
  );
}
