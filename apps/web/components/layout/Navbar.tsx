'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/fornecedores', label: 'Fornecedores' },
  { href: '/produtos', label: 'Produtos' },
];

/** Barra de navegação superior, com destaque para a rota ativa. */
export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link href="/" className="navbar__brand">
          <span aria-hidden="true">📦</span> Controle de Estoque
        </Link>
        <div className="navbar__links">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar__link${active ? ' navbar__link--active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
