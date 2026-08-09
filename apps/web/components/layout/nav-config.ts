import { Boxes, LayoutDashboard, Link2, Package, Palette, type LucideIcon } from 'lucide-react';

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

/** Navegação da sidebar — fonte única para a barra fixa e para o drawer mobile. */
export const NAV_SECTIONS: NavSection[] = [
  {
    items: [{ href: '/', label: 'Início', icon: LayoutDashboard }],
  },
  {
    title: 'Gestão',
    items: [
      { href: '/produtos', label: 'Produtos', icon: Package, matchNested: true },
      { href: '/fornecedores', label: 'Fornecedores', icon: Boxes, matchNested: true },
      { href: '/associacao', label: 'Associação', icon: Link2 },
    ],
  },
  {
    title: 'Sistema',
    items: [{ href: '/design-system', label: 'Design System', icon: Palette }],
  },
];

/**
 * Regra única de "rota ativa", compartilhada por sidebar e drawer.
 *
 * `/produtos/[id]/fornecedores` é a tela de associação a partir de um produto:
 * ela mantém **Produtos** ativo (é uma subrota) — o item "Associação" leva ao
 * ponto de entrada dessa mesma funcionalidade.
 */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.href === '/') return pathname === '/';
  return item.matchNested ? pathname.startsWith(item.href) : pathname === item.href;
}
