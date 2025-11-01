/**
 * API response type definitions
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Dashboard statistics for admin
 */
export interface DashboardStats {
  totalLansia: number;
  totalPetugas: number;
  pemeriksaanBulanIni: number;
  petugasAktif: number;
  pemeriksaanPerBulan: MonthlyPemeriksaan[];
  rataRataKesehatan: HealthAverages;
}

/**
 * Monthly pemeriksaan count
 */
export interface MonthlyPemeriksaan {
  bulan: string;
  jumlah: number;
}

/**
 * Average health metrics
 */
export interface HealthAverages {
  tekananDarah: number;
  gulaDarah: number;
  kolesterol: number;
}

/**
 * Error response from API
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
