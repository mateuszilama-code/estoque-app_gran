'use client';

import { Menu, Package } from 'lucide-react';
import type { ReactNode } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { SIDEBAR_WIDTH, Sidebar, SidebarMobile, SidebarProvider, useSidebar } from './Sidebar';

/** Barra superior escura exibida apenas abaixo de `lg`, onde a sidebar vira drawer. */
function MobileTopBar() {
  const { setMobileOpen } = useSidebar();

  return (
    <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-sidebar-border bg-sidebar px-4 lg:hidden">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu de navegação"
        className="grid size-9 place-items-center rounded-md text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-active-foreground"
      >
        <Menu className="size-5" aria-hidden />
      </button>
      <span className="flex items-center gap-2 font-medium text-sidebar-active-foreground">
        <Package className="size-4" aria-hidden />
        Estoque
      </span>
    </div>
  );
}

function ShellBody({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div
      className="min-h-screen bg-background"
      style={
        {
          '--sidebar-width': collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded,
        } as React.CSSProperties
      }
    >
      <Sidebar />
      <SidebarMobile />
      <div className={cn('transition-[padding] duration-200', 'lg:pl-[var(--sidebar-width)]')}>
        <MobileTopBar />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

/**
 * Casca da aplicação: sidebar escura fixa + área de conteúdo clara.
 * O refinamento responsivo detalhado é feito na etapa de layout shell.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <ShellBody>{children}</ShellBody>
      <Toaster />
    </SidebarProvider>
  );
}
