import { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  align?: 'left' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyField: (row: T) => string | number;
  emptyTitle?: string;
  emptyHint?: string;
}

/**
 * Tabela genérica do design system. Recebe a definição de colunas e as linhas;
 * renderiza um estado vazio quando não há dados.
 */
export function Table<T>({
  columns,
  rows,
  keyField,
  emptyTitle = 'Nenhum registro encontrado',
  emptyHint,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="table-wrap">
        <div className="empty-state">
          <div className="empty-state__title">{emptyTitle}</div>
          {emptyHint && <div className="text-sm">{emptyHint}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={{ textAlign: col.align ?? 'left', width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={keyField(row)}>
              {columns.map((col, i) => (
                <td key={i} style={{ textAlign: col.align ?? 'left' }}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
