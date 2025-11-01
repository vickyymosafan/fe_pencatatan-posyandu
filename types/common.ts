/**
 * Common type definitions shared across the application
 */

/**
 * Generic ID type for database entities
 */
export type ID = string;

/**
 * ISO 8601 date string format
 */
export type DateString = string;

/**
 * Pagination parameters for list queries
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Sort order for queries
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Generic sort parameters
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: SortOrder;
}

/**
 * Generic search parameters
 */
export interface SearchParams {
  search?: string;
}
