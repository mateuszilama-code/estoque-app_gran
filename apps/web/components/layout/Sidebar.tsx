'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { ExternalLink, PanelLeftClose, PanelLeftOpen, Package } from 'lucide-react';

import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { NAV_SECTIONS, isNavItemActive, type NavItem } from './nav-config';

interface SidebarContextValue {
  /** Preferência do usuário: manter a barra em trilho mesmo no desktop (lg+). */
  collapsed: boolean;
  toggleCollapsed: () => void;
  /** Drawer de navegação (abaixo de md). */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/** Estado da navegação, compartilhado entre a Sidebar, o AppShell e o drawer. */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed((value) => !value), []);

  const value = useMemo(
    () => ({ collapsed, toggleCollapsed, mobileOpen, setMobileOpen }),
    [collapsed, toggleCollapsed, mobileOpen],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar precisa estar dentro de <SidebarProvider>.');
  return context;
}

/**
 * Larguras da barra e o padding correspondente do conteúdo — declarados juntos
 * para que os dois nunca saiam de sincronia.
 */
export const SIDEBAR = {
  rail: 'w-[4.5rem]', // 72px — modo trilho (só ícones)
  expanded: 'w-60', // 240px — expandida, com rótulos
  contentRail: 'md:pl-[4.5rem]',
  contentExpanded: 'lg:pl-60',
} as const;

/**
 * Classes que revelam/escondem os rótulos conforme o modo da barra.
 *
 * A decisão é feita **em CSS** (media query + `hover`/`focus-within`), não em
 * JavaScript: nada de `matchMedia`, então não há divergência de hidratação nem
 * piscada de layout no primeiro render. A regra é sempre a mesma:
 * escondido no trilho → visível ao passar o mouse, ao focar por teclado, ou a
 * partir de `lg` quando a barra não está recolhida por escolha do usuário.
 */
function revealClasses(collapsed: boolean) {
  return {
    /** Rótulos em linha (texto ao lado do ícone). */
    label: cn(
      'hidden group-hover/sidebar:inline group-focus-within/sidebar:inline',
      !collapsed && 'lg:inline',
    ),
    /** Blocos (títulos de seção). */
    block: cn(
      'hidden group-hover/sidebar:block group-focus-within/sidebar:block',
      !collapsed && 'lg:block',
    ),
    /** Elemento que só existe no trilho (separador no lugar do título). */
    railOnly: cn(
      'block group-hover/sidebar:hidden group-focus-within/sidebar:hidden',
      !collapsed && 'lg:hidden',
    ),
    /** Linha de item: centralizada no trilho, alinhada à esquerda quando expandida. */
    row: cn(
      'justify-center px-0',
      'group-hover/sidebar:justify-start group-hover/sidebar:px-3',
      'group-focus-within/sidebar:justify-start group-focus-within/sidebar:px-3',
      !collapsed && 'lg:justify-start lg:px-3',
    ),
  };
}

type Reveal = ReturnType<typeof revealClasses>;

/** Variante do drawer: sempre expandida, sem depender de hover. */
const REVEAL_FULL: Reveal = {
  label: '',
  block: '',
  railOnly: 'hidden',
  row: 'px-3',
};

function NavLink({
  item,
  reveal,
  onNavigate,
}: {
  item: NavItem;
  reveal: Reveal;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isNavItemActive(item, pathname);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      // O rótulo visível some no modo trilho (`display:none` sai da árvore de
      // acessibilidade), então o nome acessível vem sempre do aria-label.
      aria-label={item.label}
      className={cn(
        'relative flex h-9 items-center gap-3 rounded-md text-body transition-colors',
        reveal.row,
        active
          ? 'bg-sidebar-active/10 font-medium text-sidebar-active-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-active-foreground',
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-sidebar-active"
        />
      )}
      <Icon className="size-4 shrink-0" aria-hidden />
      <span aria-hidden className={cn('truncate', reveal.label)}>
        {item.label}
      </span>
    </Link>
  );
}

function SidebarContent({ reveal, onNavigate }: { reveal: Reveal; onNavigate?: () => void }) {
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    <div className="flex h-full flex-col overflow-hidden bg-sidebar">
      {/* Marca */}
      <div className="shrink-0 border-b border-sidebar-border px-3">
        <div className={cn('flex h-16 items-center gap-2.5', reveal.row)}>
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-active/10 text-sidebar-active-foreground">
            <Package className="size-4" aria-hidden />
          </span>
          <span className={cn('truncate font-medium text-sidebar-active-foreground', reveal.label)}>
            Estoque
          </span>
        </div>
      </div>

      {/* Navegação */}
      <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section, index) => (
          <div key={section.title ?? `secao-${index}`} className={cn(index > 0 && 'mt-6')}>
            {section.title && (
              <>
                <p
                  className={cn(
                    'mb-2 truncate px-3 text-caption font-medium uppercase text-sidebar-muted',
                    reveal.block,
                  )}
                >
                  {section.title}
                </p>
                <div
                  aria-hidden
                  className={cn('mx-3 mb-2 h-px bg-sidebar-border', reveal.railOnly)}
                />
              </>
            )}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} reveal={reveal} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Rodapé: documentação da API + alternar largura */}
      <div className="shrink-0 border-t border-sidebar-border p-3">
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/docs`}
          target="_blank"
          rel="noreferrer"
          aria-label="Documentação da API"
          className={cn(
            'flex h-9 items-center gap-3 rounded-md text-body text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-active-foreground',
            reveal.row,
          )}
        >
          <ExternalLink className="size-4 shrink-0" aria-hidden />
          <span aria-hidden className={cn('truncate', reveal.label)}>
            Documentação da API
          </span>
        </a>
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          aria-pressed={collapsed}
          className={cn(
            'hidden h-9 w-full items-center gap-3 rounded-md text-body text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-active-foreground lg:flex',
            reveal.row,
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4 shrink-0" aria-hidden />
          ) : (
            <PanelLeftClose className="size-4 shrink-0" aria-hidden />
          )}
          <span aria-hidden className={cn('truncate', reveal.label)}>
            Recolher
          </span>
        </button>
      </div>
    </div>
  );
}

/**
 * Barra lateral escura fixa, a partir de `md`.
 *
 * - `md` (768–1023px): trilho de 72px; expande para 240px ao passar o mouse ou
 *   ao receber foco, sobrepondo o conteúdo (o padding do conteúdo não muda).
 * - `lg+` (≥1024px): expandida por padrão; o botão "Recolher" a leva ao mesmo
 *   trilho, que também expande no hover.
 */
export function Sidebar() {
  const { collapsed } = useSidebar();
  const reveal = revealClasses(collapsed);

  return (
    <aside
      className={cn(
        'group/sidebar fixed inset-y-0 left-0 z-30 hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:block',
        SIDEBAR.rail,
        'hover:w-60 focus-within:w-60',
        // A sobreposição só existe no modo trilho; expandida, dispensa sombra.
        'hover:shadow-overlay focus-within:shadow-overlay',
        !collapsed && 'lg:w-60 lg:hover:shadow-none lg:focus-within:shadow-none',
      )}
    >
      <SidebarContent reveal={reveal} />
    </aside>
  );
}

/** A mesma navegação como drawer, abaixo de `md`. */
export function SidebarMobile() {
  const { mobileOpen, setMobileOpen } = useSidebar();

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent
        side="left"
        className={cn(
          'border-sidebar-border bg-sidebar p-0 text-sidebar-foreground',
          SIDEBAR.expanded,
        )}
      >
        <SheetTitle className="sr-only">Navegação principal</SheetTitle>
        <SheetDescription className="sr-only">
          Acesso às telas de produtos, fornecedores, associação e documentação da API.
        </SheetDescription>
        <SidebarContent reveal={REVEAL_FULL} onNavigate={() => setMobileOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
