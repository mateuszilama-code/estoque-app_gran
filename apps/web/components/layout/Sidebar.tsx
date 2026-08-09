'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { ExternalLink, PanelLeftClose, PanelLeftOpen, Package } from 'lucide-react';

import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { NAV_SECTIONS, isNavItemActive, type NavItem } from './nav-config';

interface SidebarContextValue {
  /** Sidebar em modo apenas-ícone (desktop). */
  collapsed: boolean;
  toggleCollapsed: () => void;
  /** Drawer de navegação (mobile). */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/** Estado da navegação, compartilhado entre a Sidebar, o Header e o drawer mobile. */
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

/** Largura da sidebar em cada estado — usada também pelo padding do conteúdo. */
export const SIDEBAR_WIDTH = { expanded: '15rem', collapsed: '4.5rem' } as const;

function NavLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
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
      title={collapsed ? item.label : undefined}
      className={cn(
        'relative flex h-9 items-center gap-3 rounded-md px-3 text-body transition-colors',
        collapsed && 'justify-center px-0',
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
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const { toggleCollapsed } = useSidebar();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Marca */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-4',
          collapsed && 'justify-center px-0',
        )}
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-active/10 text-sidebar-active-foreground">
          <Package className="size-4" aria-hidden />
        </span>
        {!collapsed && (
          <span className="truncate font-medium text-sidebar-active-foreground">Estoque</span>
        )}
      </div>

      {/* Navegação */}
      <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section, index) => (
          <div key={section.title ?? `secao-${index}`} className={cn(index > 0 && 'mt-6')}>
            {section.title && !collapsed && (
              <p className="mb-2 px-3 text-caption font-medium uppercase text-sidebar-muted">
                {section.title}
              </p>
            )}
            {section.title && collapsed && (
              <div aria-hidden className="mx-3 mb-2 h-px bg-sidebar-border" />
            )}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} collapsed={collapsed} onNavigate={onNavigate} />
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
          title={collapsed ? 'Documentação da API' : undefined}
          className={cn(
            'flex h-9 items-center gap-3 rounded-md px-3 text-body text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-active-foreground',
            collapsed && 'justify-center px-0',
          )}
        >
          <ExternalLink className="size-4 shrink-0" aria-hidden />
          {!collapsed && <span className="truncate">Documentação da API</span>}
        </a>
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          className={cn(
            'hidden h-9 w-full items-center gap-3 rounded-md px-3 text-body text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-active-foreground lg:flex',
            collapsed && 'justify-center px-0',
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4 shrink-0" aria-hidden />
          ) : (
            <PanelLeftClose className="size-4 shrink-0" aria-hidden />
          )}
          {!collapsed && <span className="truncate">Recolher</span>}
        </button>
      </div>
    </div>
  );
}

/** Sidebar escura fixa (lg+), com estado expandido/colapsado. */
export function Sidebar() {
  const { collapsed } = useSidebar();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden border-r border-sidebar-border transition-[width] duration-200 lg:block"
      style={{ width: collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded }}
    >
      <SidebarContent collapsed={collapsed} />
    </aside>
  );
}

/** Mesma navegação como drawer, para telas menores que lg. */
export function SidebarMobile() {
  const { mobileOpen, setMobileOpen } = useSidebar();

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent
        side="left"
        className="w-60 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
      >
        <SheetTitle className="sr-only">Navegação principal</SheetTitle>
        <SheetDescription className="sr-only">
          Acesso às telas de produtos, fornecedores e documentação da API.
        </SheetDescription>
        <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
