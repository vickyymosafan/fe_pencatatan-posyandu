/**
 * Users API
 * Handles user management operations (CRUD)
 * Pure logic - no UI dependencies
 */

import { apiClient } from './client';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

/**
 * Get all users with pagination
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @returns Promise with paginated user list
 */
export const getAllUsers = async (
  page = 1,
  limit = 10
): Promise<ApiResponse<PaginatedResponse<User>>> => {
  return apiClient.get<PaginatedResponse<User>>(
    `/api/users?page=${page}&limit=${limit}`
  );
};

/**
 * Get user by ID
 * @param id - User ID
 * @returns Promise with user data
 */
export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  return apiClient.get<User>(`/api/users/${id}`);
};

/**
 * Create new user
 * @param data - User creation data
 * @returns Promise with created user data
 */
export const createUser = async (
  data: CreateUserRequest
): Promise<ApiResponse<User>> => {
  return apiClient.post<User>('/api/users', data);
};

/**
 * Update existing user
 * @param id - User ID
 * @param data - User update data (partial)
 * @returns Promise with updated user data
 */
export const updateUser = async (
  id: string,
  data: UpdateUserRequest
): Promise<ApiResponse<User>> => {
  return apiClient.put<User>(`/api/users/${id}`, data);
};

/**
 * Delete user
 * @param id - User ID
 * @returns Promise with deletion result
 */
export const deleteUser = async (id: string): Promise<ApiResponse<void>> => {
  return apiClient.delete<void>(`/api/users/${id}`);
};
