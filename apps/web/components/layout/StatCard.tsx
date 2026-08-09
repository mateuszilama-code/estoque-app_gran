import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type StatTone = 'default' | 'success' | 'warning' | 'destructive';

const TONE_CLASS: Record<StatTone, { chip: string; hint: string }> = {
  default: { chip: 'bg-muted text-muted-foreground', hint: 'text-muted-foreground' },
  success: { chip: 'bg-success-soft text-success-soft-foreground', hint: 'text-success' },
  warning: { chip: 'bg-warning-soft text-warning-soft-foreground', hint: 'text-warning' },
  destructive: {
    chip: 'bg-destructive-soft text-destructive-soft-foreground',
    hint: 'text-destructive',
  },
};

export interface StatCardProps {
  /** Rótulo em caixa alta (caption). */
  label: string;
  value: ReactNode;
  /** Unidade exibida ao lado do número (ex.: "itens", "produtos"). */
  unit?: string;
  /** Texto de apoio abaixo do número. */
  hint?: string;
  icon?: LucideIcon;
  tone?: StatTone;
  className?: string;
}

/** Indicador numérico: número grande + rótulo, como na faixa de estatísticas da referência. */
export function StatCard({
  label,
  value,
  unit,
  hint,
  icon: Icon,
  tone = 'default',
  className,
}: StatCardProps) {
  const tones = TONE_CLASS[tone];

  return (
    <div className={cn('flex items-start justify-between gap-3 p-5', className)}>
      <div className="min-w-0">
        <p className="caption">{label}</p>
        <p className="mt-2 flex items-baseline gap-1.5 text-stat text-foreground">
          <span className="truncate">{value}</span>
          {unit && <span className="text-body font-normal text-muted-foreground">{unit}</span>}
        </p>
        {hint && <p className={cn('mt-1 truncate text-xs', tones.hint)}>{hint}</p>}
      </div>
      {Icon && (
        <span className={cn('grid size-9 shrink-0 place-items-center rounded-md', tones.chip)}>
          <Icon className="size-4" aria-hidden />
        </span>
      )}
    </div>
  );
}

export interface StatCardGridProps {
  children: ReactNode;
  /**
   * `panel` (padrão) agrupa os indicadores em um único card com divisórias,
   * como a faixa "Product Statistic" da referência. `cards` separa em cards
   * independentes.
   */
  variant?: 'panel' | 'cards';
  className?: string;
}

export function StatCardGrid({ children, variant = 'panel', className }: StatCardGridProps) {
  if (variant === 'cards') {
    return (
      <div
        className={cn(
          'grid gap-4 sm:grid-cols-2 xl:grid-cols-4 [&>*]:rounded-lg [&>*]:border [&>*]:border-border [&>*]:bg-card [&>*]:shadow-card',
          className,
        )}
      >
        {children}
      </div>
    );
  }

  // O `gap-px` sobre um fundo na cor da borda desenha as divisórias em qualquer
  // quantidade de colunas, sem depender de seletores por posição.
  return (
    <div
      className={cn(
        'grid gap-px overflow-hidden rounded-lg border border-border bg-border shadow-card sm:grid-cols-2 xl:grid-cols-4 [&>*]:bg-card',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Estado de carregamento com o mesmo gabarito do StatCard. */
export function StatCardSkeleton() {
  return (
    <div className="p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-7 w-16" />
    </div>
  );
}
