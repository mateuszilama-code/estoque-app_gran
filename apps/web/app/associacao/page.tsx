import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Link2 } from 'lucide-react';

import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Associação — Controle de Estoque',
};

/**
 * Ponto de entrada da associação Produto ↔ Fornecedor.
 *
 * A associação é gerenciada **a partir de um produto**
 * (`/produtos/[id]/fornecedores`), então esta tela existe para dar um destino
 * ao item "Associação" da navegação e explicar o caminho. A seleção de produto
 * embutida aqui entra na etapa de reconstrução das telas.
 */
export default function AssociacaoPage() {
  return (
    <>
      <Header
        title="Associação"
        description="Vincule fornecedores aos produtos do estoque."
        actions={
          <Button asChild>
            <Link href="/produtos">
              Escolher produto
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <Card className="p-8 text-center">
        <span className="mx-auto grid size-11 place-items-center rounded-lg bg-muted text-muted-foreground">
          <Link2 className="size-5" aria-hidden />
        </span>
        <h2 className="mt-4 text-h3">Comece escolhendo um produto</h2>
        <p className="mx-auto mt-2 max-w-prose text-body text-muted-foreground">
          Cada produto tem sua própria lista de fornecedores. Abra um produto na tela de Produtos e
          use a ação <strong className="font-medium text-foreground">Fornecedores</strong> para
          associar ou desassociar — um fornecedor não pode ser associado duas vezes ao mesmo
          produto.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/produtos">Ir para Produtos</Link>
        </Button>
      </Card>
    </>
  );
}
