/**
 * Pemeriksaan API
 * Handles health examination records operations
 * Pure logic - no UI dependencies
 */

import { apiClient } from './client';
import {
  Pemeriksaan,
  CreatePemeriksaanRequest,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

/**
 * Get all pemeriksaan records with pagination
 * @param lansiaId - Optional filter by lansia ID
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @returns Promise with paginated pemeriksaan list
 */
export const getAllPemeriksaan = async (
  lansiaId?: string,
  page = 1,
  limit = 10
): Promise<ApiResponse<PaginatedResponse<Pemeriksaan>>> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (lansiaId) {
    params.append('lansiaId', lansiaId);
  }

  return apiClient.get<PaginatedResponse<Pemeriksaan>>(
    `/api/pemeriksaan?${params.toString()}`
  );
};

/**
 * Get pemeriksaan by ID
 * @param id - Pemeriksaan ID
 * @returns Promise with pemeriksaan data
 */
export const getPemeriksaanById = async (
  id: string
): Promise<ApiResponse<Pemeriksaan>> => {
  return apiClient.get<Pemeriksaan>(`/api/pemeriksaan/${id}`);
};

/**
 * Create new pemeriksaan record
 * @param data - Pemeriksaan creation data
 * @returns Promise with created pemeriksaan data
 */
export const createPemeriksaan = async (
  data: CreatePemeriksaanRequest
): Promise<ApiResponse<Pemeriksaan>> => {
  return apiClient.post<Pemeriksaan>('/api/pemeriksaan', data);
};
