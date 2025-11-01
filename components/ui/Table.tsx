/**
 * Table Component
 * Reusable table with generic type support, pagination, and loading states
 * Follows design system specifications
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Skeleton } from './Skeleton';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  pagination?: PaginationConfig;
  className?: string;
}

/**
 * Table Component
 * 
 * @example
 * <Table
 *   columns={[
 *     { key: 'name', header: 'Name' },
 *     { key: 'email', header: 'Email' },
 *   ]}
 *   data={users}
 *   onRowClick={handleRowClick}
 *   pagination={paginationConfig}
 * />
 */
export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  isLoading = false,
  pagination,
  className,
}: TableProps<T>) {
  const hasRowClick = !!onRowClick;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <p>Tidak ada data</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="py-3 px-4 text-left text-sm font-semibold text-neutral-700"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  'border-b border-neutral-200 transition-colors',
                  hasRowClick && 'cursor-pointer hover:bg-neutral-50'
                )}
                onClick={() => onRowClick?.(row)}
                role={hasRowClick ? 'button' : undefined}
                tabIndex={hasRowClick ? 0 : undefined}
                onKeyDown={
                  hasRowClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-3 px-4 text-sm text-neutral-900">
                    {column.render ? column.render(row) : String(row[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between mt-4 px-4">
          <p className="text-sm text-neutral-600">
            Halaman {pagination.currentPage} dari {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
