import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ToastProvider } from '@/components/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Controle de Estoque',
  description: 'Sistema de Controle de Estoque — Fornecedores, Produtos e Associações.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ToastProvider>
          <div className="app-shell">
            <Navbar />
            <main className="container">{children}</main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
