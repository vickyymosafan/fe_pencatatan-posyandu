/**
 * Laporan API
 * Handles dashboard statistics and report generation
 * Pure logic - no UI dependencies
 */

import { apiClient } from './client';
import { DashboardStats, Pemeriksaan, ApiResponse } from '@/types';

/**
 * Get dashboard statistics
 * Includes total counts, monthly trends, and health averages
 * @returns Promise with dashboard statistics
 */
export const getDashboardStats = async (): Promise<
  ApiResponse<DashboardStats>
> => {
  return apiClient.get<DashboardStats>('/api/laporan/dashboard');
};

/**
 * Get pemeriksaan records for report generation
 * @param startDate - Start date in ISO format (YYYY-MM-DD)
 * @param endDate - End date in ISO format (YYYY-MM-DD)
 * @param lansiaId - Optional filter by specific lansia
 * @returns Promise with pemeriksaan records for the date range
 */
export const getPemeriksaanReport = async (
  startDate: string,
  endDate: string,
  lansiaId?: string
): Promise<ApiResponse<Pemeriksaan[]>> => {
  const params = new URLSearchParams({
    startDate,
    endDate,
  });

  if (lansiaId) {
    params.append('lansiaId', lansiaId);
  }

  return apiClient.get<Pemeriksaan[]>(
    `/api/laporan/pemeriksaan?${params.toString()}`
  );
};
