import type { Config } from 'tailwindcss';
// Importado no topo, e não via `require()`: este arquivo tem `export default`,
// então o Node o carrega como módulo ES — onde `require` não existe.
import animate from 'tailwindcss-animate';

/**
 * Design tokens do Sistema de Controle de Estoque.
 *
 * Os valores concretos moram em `app/globals.css` (custom properties CSS, em HSL),
 * e este arquivo apenas os expõe como utilitários do Tailwind. Assim os mesmos
 * tokens servem para classes utilitárias (`bg-muted`), para os componentes do
 * shadcn/ui e para CSS puro (`hsl(var(--border))`).
 *
 * Espaçamento: mantemos a escala padrão do Tailwind, que já é múltipla de 4px
 * (1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px, 5 = 20px, 6 = 24px, 8 = 32px, 10 = 40px).
 */
const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
          soft: 'hsl(var(--success-soft))',
          'soft-foreground': 'hsl(var(--success-soft-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          soft: 'hsl(var(--warning-soft))',
          'soft-foreground': 'hsl(var(--warning-soft-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          soft: 'hsl(var(--destructive-soft))',
          'soft-foreground': 'hsl(var(--destructive-soft-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          muted: 'hsl(var(--sidebar-muted))',
          accent: 'hsl(var(--sidebar-accent))',
          active: 'hsl(var(--sidebar-active))',
          'active-foreground': 'hsl(var(--sidebar-active-foreground))',
          border: 'hsl(var(--sidebar-border))',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Escala tipográfica do dashboard (denso: corpo em 14px).
        h1: ['1.75rem', { lineHeight: '2.125rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        h2: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em', fontWeight: '600' }],
        h3: ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.005em', fontWeight: '600' }],
        body: ['0.875rem', { lineHeight: '1.375rem' }],
        'body-lg': ['1rem', { lineHeight: '1.5rem' }],
        caption: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.06em' }],
        stat: ['1.5rem', { lineHeight: '1.875rem', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
      borderRadius: {
        // radius-lg = 12px (cards, tabelas) | radius-md = 8px (inputs, botões)
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 6px)',
      },
      boxShadow: {
        // Sombra única e sutil para cards; `overlay` só para camadas flutuantes.
        card: '0 1px 2px 0 rgb(16 24 40 / 0.04), 0 1px 3px 0 rgb(16 24 40 / 0.06)',
        overlay: '0 8px 32px -8px rgb(16 24 40 / 0.18), 0 2px 8px -2px rgb(16 24 40 / 0.08)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      transitionDuration: {
        // MOTION_INTENSITY baixo/médio: transições curtas e discretas.
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [animate],
};

export default config;
