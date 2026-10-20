import React from 'react';
import { Skeleton } from './Skeleton';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  isLoading?: boolean;
  loadingRowCount?: number;
  emptyState?: React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  loadingRowCount = 5,
  emptyState,
  className = '',
}: DataTableProps<T>): React.ReactElement {
  if (isLoading) {
    return (
      <div className={`w-full overflow-hidden rounded-2xl border border-[#EAE5DB] bg-white ${className}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EAE5DB]">
                {columns.map((col) => (
                  <th key={col.key} className="py-3.5 px-4 text-xs font-semibold text-[#5F6D61] uppercase tracking-wider">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE5DB]">
              {Array.from({ length: loadingRowCount }).map((_, rIdx) => (
                <tr key={rIdx}>
                  {columns.map((col) => (
                    <td key={col.key} className="py-4 px-4">
                      <Skeleton className="h-4 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className={`w-full rounded-2xl border border-[#EAE5DB] bg-white p-8 ${className}`}>
        {emptyState}
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-[#EAE5DB] bg-white shadow-xs ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF7F2] border-b border-[#EAE5DB]">
              {columns.map((col) => {
                const alignClass =
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={`py-3.5 px-4 text-xs font-semibold text-[#5F6D61] tracking-wider ${alignClass} ${
                      col.className || ''
                    }`}
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE5DB] text-xs sm:text-sm">
            {data.map((item, idx) => (
              <tr
                key={keyExtractor(item, idx)}
                className="hover:bg-[#FAF7F2]/60 transition-colors"
              >
                {columns.map((col) => {
                  const alignClass =
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
                  return (
                    <td
                      key={col.key}
                      className={`py-3.5 px-4 text-[#223B28] whitespace-nowrap ${alignClass} ${col.className || ''}`}
                    >
                      {col.render
                        ? col.render(item, idx)
                        : (item as Record<string, unknown>)[col.key] != null
                        ? String((item as Record<string, unknown>)[col.key])
                        : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default DataTable;
