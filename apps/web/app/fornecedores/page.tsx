'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  Button,
  Field,
  Input,
  Modal,
  Pagination,
  Table,
  useToast,
  type Column,
} from '@/components/legacy';
import { ApiError, api } from '@/lib/api';
import { maskCNPJ, maskTelefone } from '@/lib/masks';
import { useListControls } from '@/lib/useListControls';
import { validarFornecedor, type FornecedorErrors } from '@/lib/validators';
import type { CreateFornecedorInput, Fornecedor } from '@/lib/types';

type CampoFornecedor = keyof CreateFornecedorInput;

const FORM_VAZIO: CreateFornecedorInput = {
  nome_empresa: '',
  cnpj: '',
  endereco: '',
  telefone: '',
  email: '',
  contato_principal: '',
};

/** Distribui as mensagens de erro do backend (que iniciam com o nome do campo) por campo. */
function mapearErrosApi(mensagens: string[]): FornecedorErrors {
  const chaves: CampoFornecedor[] = [
    'nome_empresa',
    'cnpj',
    'endereco',
    'telefone',
    'email',
    'contato_principal',
  ];
  const erros: FornecedorErrors = {};
  for (const msg of mensagens) {
    const campo = chaves.find((c) => msg.startsWith(c));
    if (campo && !erros[campo]) erros[campo] = msg;
  }
  return erros;
}

export default function FornecedoresPage() {
  const toast = useToast();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [erroCarregar, setErroCarregar] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState<CreateFornecedorInput>(FORM_VAZIO);
  const [erros, setErros] = useState<FornecedorErrors>({});
  const [enviando, setEnviando] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErroCarregar(null);
    try {
      setFornecedores(await api.fornecedores.list());
    } catch (e) {
      setErroCarregar(e instanceof ApiError ? e.message : 'Erro ao carregar fornecedores.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const searchable = useCallback(
    (f: Fornecedor) => `${f.nome_empresa} ${f.cnpj} ${f.contato_principal} ${f.email}`,
    [],
  );
  const lista = useListControls(fornecedores, searchable);

  function abrirModal() {
    setForm(FORM_VAZIO);
    setErros({});
    setModalAberto(true);
  }

  function atualizar(campo: CampoFornecedor, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: undefined }));
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const errosClient = validarFornecedor(form);
    if (Object.keys(errosClient).length > 0) {
      setErros(errosClient);
      return;
    }

    setEnviando(true);
    setErros({});
    try {
      await api.fornecedores.create(form);
      toast.success('Fornecedor cadastrado com sucesso!');
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

  async function remover(f: Fornecedor) {
    if (!window.confirm(`Remover o fornecedor "${f.nome_empresa}"?`)) return;
    try {
      await api.fornecedores.remove(f.id);
      toast.success('Fornecedor removido com sucesso!');
      await carregar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível remover.');
    }
  }

  const columns: Column<Fornecedor>[] = [
    { header: 'Empresa', cell: (f) => <strong>{f.nome_empresa}</strong> },
    { header: 'CNPJ', cell: (f) => <span className="mono">{f.cnpj}</span> },
    { header: 'Contato', cell: (f) => f.contato_principal },
    { header: 'Telefone', cell: (f) => f.telefone },
    { header: 'E-mail', cell: (f) => f.email },
    {
      header: 'Ações',
      align: 'right',
      cell: (f) => (
        <div className="table__actions">
          <Button variant="danger" size="sm" onClick={() => remover(f)}>
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
          <h1 className="page-header__title">Fornecedores</h1>
          <p className="page-header__subtitle">Cadastro e gestão de fornecedores (CNPJ único).</p>
        </div>
        <Button onClick={abrirModal}>+ Novo fornecedor</Button>
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
                aria-label="Buscar fornecedores"
                placeholder="Buscar por empresa, CNPJ, contato…"
                value={lista.query}
                onChange={(e) => lista.setQuery(e.target.value)}
              />
            </div>
            <span className="toolbar__count">
              {lista.total} {lista.total === 1 ? 'fornecedor' : 'fornecedores'}
            </span>
          </div>

          <Table
            columns={columns}
            rows={lista.pageItems}
            keyField={(f) => f.id}
            emptyTitle={
              fornecedores.length === 0
                ? 'Nenhum fornecedor cadastrado'
                : 'Nenhum resultado para a busca'
            }
            emptyHint={
              fornecedores.length === 0 ? 'Clique em “Novo fornecedor” para começar.' : undefined
            }
          />
          <Pagination page={lista.page} totalPages={lista.totalPages} onPage={lista.setPage} />
        </>
      )}

      <Modal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Novo fornecedor"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAberto(false)} disabled={enviando}>
              Cancelar
            </Button>
            <Button type="submit" form="form-fornecedor" loading={enviando}>
              Salvar
            </Button>
          </>
        }
      >
        <form id="form-fornecedor" onSubmit={enviar} noValidate>
          <Field label="Nome da empresa" htmlFor="nome_empresa" required error={erros.nome_empresa}>
            <Input
              id="nome_empresa"
              placeholder="Tech Distribuidora LTDA"
              value={form.nome_empresa}
              invalid={Boolean(erros.nome_empresa)}
              onChange={(e) => atualizar('nome_empresa', e.target.value)}
            />
          </Field>

          <div className="grid-2">
            <Field label="CNPJ" htmlFor="cnpj" required error={erros.cnpj}>
              <Input
                id="cnpj"
                inputMode="numeric"
                placeholder="00.000.000/0000-00"
                value={form.cnpj}
                invalid={Boolean(erros.cnpj)}
                onChange={(e) => atualizar('cnpj', maskCNPJ(e.target.value))}
              />
            </Field>

            <Field label="Telefone" htmlFor="telefone" required error={erros.telefone}>
              <Input
                id="telefone"
                inputMode="numeric"
                placeholder="(00) 00000-0000"
                value={form.telefone}
                invalid={Boolean(erros.telefone)}
                onChange={(e) => atualizar('telefone', maskTelefone(e.target.value))}
              />
            </Field>
          </div>

          <Field label="Endereço" htmlFor="endereco" required error={erros.endereco}>
            <Input
              id="endereco"
              placeholder="Rua, nº - Cidade/UF"
              value={form.endereco}
              invalid={Boolean(erros.endereco)}
              onChange={(e) => atualizar('endereco', e.target.value)}
            />
          </Field>

          <div className="grid-2">
            <Field label="E-mail" htmlFor="email" required error={erros.email}>
              <Input
                id="email"
                type="email"
                placeholder="contato@empresa.com"
                value={form.email}
                invalid={Boolean(erros.email)}
                onChange={(e) => atualizar('email', e.target.value)}
              />
            </Field>

            <Field
              label="Contato principal"
              htmlFor="contato_principal"
              required
              error={erros.contato_principal}
            >
              <Input
                id="contato_principal"
                placeholder="Nome do responsável"
                value={form.contato_principal}
                invalid={Boolean(erros.contato_principal)}
                onChange={(e) => atualizar('contato_principal', e.target.value)}
              />
            </Field>
          </div>
        </form>
      </Modal>
    </>
  );
}
