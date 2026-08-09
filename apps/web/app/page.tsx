import Link from 'next/link';

/** Home — visão geral com atalhos para as features do sistema. */
export default function HomePage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Sistema de Controle de Estoque</h1>
          <p className="page-header__subtitle">
            Cadastre fornecedores e produtos e gerencie a associação entre eles.
          </p>
        </div>
      </div>

      <div className="grid-2">
        <Link href="/fornecedores" className="card card--pad stack" style={{ gap: 8 }}>
          <h2 style={{ fontSize: 'var(--fs-lg)' }}>🏢 Fornecedores</h2>
          <p className="text-muted text-sm">
            Cadastro e gestão de fornecedores, com CNPJ único por fornecedor.
          </p>
        </Link>

        <Link href="/produtos" className="card card--pad stack" style={{ gap: 8 }}>
          <h2 style={{ fontSize: 'var(--fs-lg)' }}>📦 Produtos</h2>
          <p className="text-muted text-sm">
            Cadastro de produtos por categoria e associação com seus fornecedores.
          </p>
        </Link>
      </div>
    </>
  );
}
