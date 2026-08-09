import { Search } from 'lucide-react';
import type { ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  /** Título da página (h1). */
  title: string;
  description?: string;
  /** Campo de busca; só é renderizado quando `onSearchChange` é informado. */
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /**
   * Ações da direita. Convenção: botões secundários primeiro
   * (`variant="outline"`, ex.: "Ordenar", "Filtrar") e a **ação primária por
   * último** — o botão preto do canto direito.
   */
  actions?: ReactNode;
  className?: string;
}

/**
 * Cabeçalho de página: título + busca + ações.
 *
 * Fica grudado no topo da área de conteúdo e sangra a borda inferior até as
 * laterais. Abaixo de `md` ele desce 56px (`top-14`) para não cobrir a barra
 * escura de navegação mobile. O botão de menu não mora aqui: é da casca.
 *
 * Quebra de linha por viewport (a mesma marcação em todas):
 * - `< sm`: título ocupa a linha inteira, ações alinhadas à direita na linha
 *   seguinte e a busca em largura total no fim;
 * - `sm+`: título · busca · ações na mesma linha, com o título absorvendo a
 *   sobra de espaço; se não couber (tablet com busca + 3 botões), as ações
 *   descem para a linha de baixo em vez de espremer o título.
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
        'sticky top-14 z-20 -mx-4 mb-6 flex flex-wrap items-center gap-3 border-b border-border bg-background px-4 py-4 sm:-mx-6 sm:px-6 md:top-0 lg:-mx-8 lg:px-8',
        className,
      )}
    >
      {/* `min-w` garante que o título nunca seja espremido: quando busca +
          ações não cabem na mesma linha, as ações é que descem. */}
      <div className="w-full min-w-0 sm:w-auto sm:min-w-[14rem] sm:flex-1">
        <h1 className="truncate text-h1">{title}</h1>
        {description && (
          <p className="mt-1 line-clamp-2 text-body text-muted-foreground sm:line-clamp-1">
            {description}
          </p>
        )}
      </div>

      {onSearchChange && (
        <div className="relative order-last w-full sm:order-none sm:w-56 lg:w-72">
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

      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
