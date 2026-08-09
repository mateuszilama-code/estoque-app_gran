import { Button } from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}

/** Paginação simples (anterior/próxima + indicador). Some quando há 1 página. */
export function Pagination({ page, totalPages, onPage }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Paginação">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        ← Anterior
      </Button>
      <span className="pagination__info" aria-live="polite">
        Página {page} de {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        aria-label="Próxima página"
      >
        Próxima →
      </Button>
    </nav>
  );
}
