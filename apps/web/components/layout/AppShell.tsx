'use client';

import { Menu, Package } from 'lucide-react';
import type { ReactNode } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { SIDEBAR, Sidebar, SidebarMobile, SidebarProvider, useSidebar } from './Sidebar';

/**
 * Barra superior escura, exibida apenas abaixo de `md` — onde a sidebar some e
 * a navegação passa a ser um drawer. É o único lugar em que o botão de menu
 * aparece, por isso mora na casca e não no `Header` de cada página.
 */
function MobileTopBar() {
  const { setMobileOpen } = useSidebar();

  return (
    <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-sidebar-border bg-sidebar px-4 md:hidden">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu de navegação"
        className="-ml-1.5 grid size-9 place-items-center rounded-md text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-active-foreground"
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
    <div className="min-h-screen bg-background">
      <Sidebar />
      <SidebarMobile />
      <div
        className={cn(
          'transition-[padding] duration-200',
          SIDEBAR.contentRail,
          !collapsed && SIDEBAR.contentExpanded,
        )}
      >
        <MobileTopBar />
        {/* Padding cresce com a viewport; a largura máxima evita linhas longas
            demais em monitores ultrawide sem desperdiçar espaço em 1280px. */}
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

/** Casca da aplicação: sidebar escura fixa + área de conteúdo clara. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <ShellBody>{children}</ShellBody>
      <Toaster />
    </SidebarProvider>
  );
}
