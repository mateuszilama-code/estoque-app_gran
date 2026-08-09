'use client';

import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Toaster global (Sonner) estilizado com os tokens do design system.
 *
 * O tema é fixo em `light` porque a aplicação ainda não expõe alternador de
 * tema — quando o modo escuro for ativado, basta trocar por `next-themes`.
 */
const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="light"
    position="top-right"
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          'group toast group-[.toaster]:rounded-lg group-[.toaster]:border-border group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:shadow-overlay',
        title: 'group-[.toast]:text-body group-[.toast]:font-medium',
        description: 'group-[.toast]:text-body group-[.toast]:text-muted-foreground',
        actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
        cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        success: 'group-[.toaster]:[&_[data-icon]]:text-success',
        error: 'group-[.toaster]:[&_[data-icon]]:text-destructive',
        warning: 'group-[.toaster]:[&_[data-icon]]:text-warning',
      },
    }}
    {...props}
  />
);

export { Toaster, toast };
