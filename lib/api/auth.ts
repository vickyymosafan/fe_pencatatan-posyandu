/**
 * Authentication API
 * Handles login and logout operations
 * Pure logic - no UI dependencies
 */

import { apiClient } from './client';
import { LoginRequest, LoginResponse, ApiResponse, User } from '@/types';
import { setCookie, deleteCookie } from '../utils/cookies';

/**
 * Login user with email and password
 * @param credentials - User login credentials
 * @returns Promise with login response containing token and user data
 */
export const login = async (
  credentials: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  return apiClient.post<LoginResponse>('/api/auth/login', credentials);
};

/**
 * Logout user
 * Clears authentication data from localStorage and cookies
 * This is a client-side only operation
 */
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  deleteCookie('auth');
  deleteCookie('role');
};

/**
 * Save authentication cookies for middleware
 * Note: localStorage is handled by useLocalStorage hook in AuthContext
 * @param user - User data
 */
export const saveAuthCookies = (user: unknown): void => {
  if (typeof window === 'undefined') return;
  
  // Save auth flag and role to cookies for middleware
  setCookie('auth', 'true', 7); // 7 days
  
  // Type-safe role extraction
  if (user && typeof user === 'object' && 'role' in user) {
    const typedUser = user as User;
    setCookie('role', typedUser.role, 7);
  }
};

/**
 * Get stored user data from localStorage
 * @returns User data or null if not found
 */
export const getStoredUser = (): unknown | null => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Get stored token from localStorage
 * @returns Token or null if not found
 */
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 * @returns Boolean indicating authentication status
 */
export const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};
