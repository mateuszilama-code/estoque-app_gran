import Link from 'next/link';
import { ArrowUpRight, Boxes, ExternalLink, Package, Palette } from 'lucide-react';

import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';

const ATALHOS = [
  {
    href: '/produtos',
    icon: Package,
    title: 'Produtos',
    description: 'Cadastro de produtos por categoria e associação com seus fornecedores.',
  },
  {
    href: '/fornecedores',
    icon: Boxes,
    title: 'Fornecedores',
    description: 'Cadastro e gestão de fornecedores, com CNPJ único por fornecedor.',
  },
  {
    href: '/design-system',
    icon: Palette,
    title: 'Design System',
    description: 'Tokens, componentes e padrões visuais que sustentam as telas.',
  },
];

/** Home — visão geral com atalhos para as features do sistema. */
export default function HomePage() {
  return (
    <>
      <Header
        title="Sistema de Controle de Estoque"
        description="Cadastre fornecedores e produtos e gerencie a associação entre eles."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ATALHOS.map(({ href, icon: Icon, title, description }) => (
          <Card
            key={href}
            className="group relative p-5 transition-colors hover:border-foreground/20"
          >
            <span className="grid size-9 place-items-center rounded-md bg-muted text-foreground">
              <Icon className="size-4" aria-hidden />
            </span>
            <h2 className="mt-4 text-h3">
              <Link href={href} className="after:absolute after:inset-0">
                {title}
              </Link>
            </h2>
            <p className="mt-1 text-body text-muted-foreground">{description}</p>
            <ArrowUpRight
              className="absolute right-5 top-5 size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
          </Card>
        ))}
      </div>

      <p className="mt-6 text-body text-muted-foreground">
        A API REST e sua documentação Swagger ficam em{' '}
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/docs`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-4"
        >
          /docs
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
        .
      </p>
    </>
  );
}
