import { cn } from '@/lib/utils';

/** Placeholder de carregamento. Usa a cor de texto secundária com baixa opacidade. */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('animate-pulse rounded-md bg-muted-foreground/15', className)} {...props} />
  );
}

export { Skeleton };
