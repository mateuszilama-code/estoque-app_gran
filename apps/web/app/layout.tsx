import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ToastProvider } from '@/components/legacy';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Controle de Estoque',
  description: 'Sistema de Controle de Estoque — Fornecedores, Produtos e Associações.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        {/* ToastProvider é o toaster legado, ainda consumido pelas telas não migradas.
            As telas novas usam `toast()` do Sonner, montado dentro do AppShell. */}
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
