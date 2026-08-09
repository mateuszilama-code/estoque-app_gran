import { Search } from 'lucide-react';
import type { ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  /** Título da página (h1). */
  title: string;
  description?: string;
  /** Campo de busca; omitido quando `onSearchChange` não é informado. */
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Botões da direita — o último costuma ser a ação primária (preta). */
  actions?: ReactNode;
  className?: string;
}

/**
 * Cabeçalho de página: título + busca + ações.
 *
 * Fica grudado no topo da área de conteúdo (`sticky`) e sangra a borda inferior
 * até as laterais, como na referência. Não inclui o botão de menu mobile: ele
 * mora na barra superior do `AppShell`.
 */
export function Header({
  title,
  description,
  searchPlaceholder = 'Buscar...',
  searchValue,
  onSearchChange,
  actions,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-14 z-20 -mx-4 mb-6 flex flex-wrap items-center gap-3 border-b border-border bg-background px-4 py-4 sm:-mx-6 sm:px-6 lg:top-0',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-h1">{title}</h1>
        {description && (
          <p className="mt-1 truncate text-body text-muted-foreground">{description}</p>
        )}
      </div>

      {onSearchChange && (
        <div className="relative order-last w-full sm:order-none sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-9 pl-9"
          />
        </div>
      )}

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
