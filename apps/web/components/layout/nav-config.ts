import { Boxes, LayoutDashboard, Package, Palette, type LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Marca o item como ativo também nas subrotas (ex.: /produtos/12/fornecedores). */
  matchNested?: boolean;
}

export interface NavSection {
  /** Rótulo em caixa alta que separa os grupos, como na referência visual. */
  title?: string;
  items: NavItem[];
}

/**
 * Navegação da sidebar.
 *
 * A tela de Associação Produto/Fornecedor não aparece aqui porque não tem rota
 * própria: ela é acessada a partir de um produto (`/produtos/[id]/fornecedores`).
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    items: [{ href: '/', label: 'Início', icon: LayoutDashboard }],
  },
  {
    title: 'Cadastros',
    items: [
      { href: '/produtos', label: 'Produtos', icon: Package, matchNested: true },
      { href: '/fornecedores', label: 'Fornecedores', icon: Boxes, matchNested: true },
    ],
  },
  {
    title: 'Sistema',
    items: [{ href: '/design-system', label: 'Design System', icon: Palette }],
  },
];

/** Regra única de "rota ativa", compartilhada por sidebar e drawer mobile. */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.href === '/') return pathname === '/';
  return item.matchNested ? pathname.startsWith(item.href) : pathname === item.href;
}
