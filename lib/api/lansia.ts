/**
 * Lansia API
 * Handles elderly (lansia) data management operations
 * Pure logic - no UI dependencies
 */

import { apiClient } from './client';
import {
  Lansia,
  LansiaWithPemeriksaan,
  CreateLansiaRequest,
  UpdateLansiaRequest,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get all lansia with pagination and optional search
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param search - Optional search query for nama or NIK
 * @returns Promise with paginated lansia list
 */
export const getAllLansia = async (
  page = 1,
  limit = 10,
  search?: string
): Promise<ApiResponse<PaginatedResponse<Lansia>>> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    params.append('search', search);
  }

  return apiClient.get<PaginatedResponse<Lansia>>(
    `/api/lansia?${params.toString()}`
  );
};

/**
 * Get lansia by ID with pemeriksaan history
 * @param id - Lansia ID
 * @returns Promise with lansia data including pemeriksaan records
 */
export const getLansiaById = async (
  id: string
): Promise<ApiResponse<LansiaWithPemeriksaan>> => {
  return apiClient.get<LansiaWithPemeriksaan>(`/api/lansia/${id}`);
};

/**
 * Create new lansia record
 * @param data - Lansia creation data
 * @returns Promise with created lansia data
 */
export const createLansia = async (
  data: CreateLansiaRequest
): Promise<ApiResponse<Lansia>> => {
  return apiClient.post<Lansia>('/api/lansia', data);
};

/**
 * Update existing lansia record
 * @param id - Lansia ID
 * @param data - Lansia update data (partial)
 * @returns Promise with updated lansia data
 */
export const updateLansia = async (
  id: string,
  data: UpdateLansiaRequest
): Promise<ApiResponse<Lansia>> => {
  return apiClient.put<Lansia>(`/api/lansia/${id}`, data);
};

/**
 * Delete lansia record
 * @param id - Lansia ID
 * @returns Promise with deletion result
 */
export const deleteLansia = async (id: string): Promise<ApiResponse<void>> => {
  return apiClient.delete<void>(`/api/lansia/${id}`);
};

/**
 * Get QR code URL for lansia
 * @param id - Lansia ID
 * @returns Full URL to QR code image
 */
export const getQRCodeUrl = (id: string): string => {
  return `${API_BASE_URL}/api/lansia/qr/${id}`;
};
