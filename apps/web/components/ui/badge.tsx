import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Badge de status.
 *
 * As variantes semânticas (success/warning/destructive) usam o par
 * "soft background + soft foreground" dos tokens, que é o tratamento adotado
 * para status de estoque (Em estoque / Estoque baixo / Esgotado) e mantém o
 * contraste AA sobre fundo claro.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'border-border bg-background text-foreground',
        success: 'border-transparent bg-success-soft text-success-soft-foreground',
        warning: 'border-transparent bg-warning-soft text-warning-soft-foreground',
        destructive: 'border-transparent bg-destructive-soft text-destructive-soft-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Exibe um ponto colorido antes do texto (padrão da referência: "• Ativo"). */
  dot?: boolean;
}

function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
