import { useMemo, useState } from 'react';

interface ListControls<T> {
  query: string;
  setQuery: (value: string) => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  total: number;
  pageItems: T[];
}

/**
 * Controla busca textual + paginação simples sobre um array em memória.
 * `searchable` deve ser memoizado (useCallback) e devolver o texto pesquisável de um item.
 */
export function useListControls<T>(
  items: T[],
  searchable: (item: T) => string,
  pageSize = 5,
): ListControls<T> {
  const [query, setQueryState] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => searchable(item).toLowerCase().includes(q));
  }, [items, query, searchable]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const setQuery = (value: string) => {
    setQueryState(value);
    setPage(1);
  };

  return {
    query,
    setQuery,
    page: currentPage,
    setPage,
    totalPages,
    total: filtered.length,
    pageItems,
  };
}
