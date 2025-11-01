/**
 * Base API Client
 * Handles all HTTP requests with authentication and error handling
 * Separated from UI - pure logic layer
 */

import { ApiResponse } from '@/types';
import { logger } from '@/lib/utils/logger';
import { getUserFriendlyMessage } from '@/lib/utils/errorMessages';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-pencatatan-posyandu.vercel.app';

/**
 * Base API Client class
 * Provides methods for HTTP operations with built-in auth and error handling
 */
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Get auth token from localStorage
   * Returns null if not found or in server-side context
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * Handle 401 Unauthorized responses
   * Clears auth data and redirects to login
   */
  private handleUnauthorized(): void {
    if (typeof window === 'undefined') return;
    
    logger.warn('Unauthorized access - clearing auth and redirecting to login');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  /**
   * Generic request method
   * Handles authentication, headers, and error responses
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Merge with any additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new Error('Session expired');
      }

      const data = await response.json();

      // Handle non-OK responses
      if (!response.ok) {
        const errorMessage = data.message || `Request failed with status ${response.status}`;
        logger.error(`API request failed: ${endpoint}`, new Error(errorMessage), {
          status: response.status,
          endpoint,
          method: options.method || 'GET',
        });
        
        return {
          error: getUserFriendlyMessage(response.status, errorMessage),
        };
      }

      logger.debug(`API request successful: ${endpoint}`, {
        endpoint,
        method: options.method || 'GET',
      });

      return { data };
    } catch (error) {
      // Handle network errors
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      logger.error(`API request error: ${endpoint}`, error instanceof Error ? error : new Error(errorMessage), {
        endpoint,
        method: options.method || 'GET',
      });
      
      if (error instanceof Error) {
        return { error: getUserFriendlyMessage(error) };
      }
      return { error: getUserFriendlyMessage('UNKNOWN_ERROR') };
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

/**
 * Singleton instance of API client
 * Export for use across the application
 */
export const apiClient = new ApiClient();
