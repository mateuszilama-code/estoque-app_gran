'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Button, Field, Input, Modal, Table, useToast, type Column } from '@/components/ui';
import { ApiError, api } from '@/lib/api';
import type { CreateFornecedorInput, Fornecedor } from '@/lib/types';

const CAMPOS: { key: keyof CreateFornecedorInput; label: string; placeholder: string }[] = [
  { key: 'nome_empresa', label: 'Nome da empresa', placeholder: 'Tech Distribuidora LTDA' },
  { key: 'cnpj', label: 'CNPJ', placeholder: '00.000.000/0000-00' },
  { key: 'endereco', label: 'Endereço', placeholder: 'Rua, nº - Cidade/UF' },
  { key: 'telefone', label: 'Telefone', placeholder: '(00) 00000-0000' },
  { key: 'email', label: 'E-mail', placeholder: 'contato@empresa.com' },
  { key: 'contato_principal', label: 'Contato principal', placeholder: 'Nome do responsável' },
];

const FORM_VAZIO: CreateFornecedorInput = {
  nome_empresa: '',
  cnpj: '',
  endereco: '',
  telefone: '',
  email: '',
  contato_principal: '',
};

/** Distribui as mensagens de erro do backend (que iniciam com o nome do campo) por campo. */
function mapearErros(mensagens: string[]): Partial<Record<keyof CreateFornecedorInput, string>> {
  const erros: Partial<Record<keyof CreateFornecedorInput, string>> = {};
  for (const msg of mensagens) {
    const campo = CAMPOS.find((c) => msg.startsWith(c.key))?.key;
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
  const [erros, setErros] = useState<Partial<Record<keyof CreateFornecedorInput, string>>>({});
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

  function abrirModal() {
    setForm(FORM_VAZIO);
    setErros({});
    setModalAberto(true);
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErros({});
    try {
      await api.fornecedores.create(form);
      toast.success('Fornecedor cadastrado com sucesso!');
      setModalAberto(false);
      await carregar();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors.length > 0) {
        setErros(mapearErros(err.fieldErrors));
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
        <Table
          columns={columns}
          rows={fornecedores}
          keyField={(f) => f.id}
          emptyTitle="Nenhum fornecedor cadastrado"
          emptyHint="Clique em “Novo fornecedor” para começar."
        />
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
          {CAMPOS.map((campo) => (
            <Field
              key={campo.key}
              label={campo.label}
              htmlFor={campo.key}
              required
              error={erros[campo.key]}
            >
              <Input
                id={campo.key}
                type={campo.key === 'email' ? 'email' : 'text'}
                placeholder={campo.placeholder}
                value={form[campo.key]}
                invalid={Boolean(erros[campo.key])}
                onChange={(e) => setForm((prev) => ({ ...prev, [campo.key]: e.target.value }))}
              />
            </Field>
          ))}
        </form>
      </Modal>
    </>
  );
}
