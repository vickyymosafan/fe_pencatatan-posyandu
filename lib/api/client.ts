/**
 * Base API Client
 * Handles all HTTP requests with authentication and error handling
 * Separated from UI - pure logic layer
 */

import { ApiResponse } from '@/types';
import { logger } from '@/lib/utils/logger';
import { getUserFriendlyMessage } from '@/lib/utils/errorMessages';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-pencatatan-posyandu.vercel.app/';

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
   * Handles both plain string and JSON-stringified tokens
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    let token = localStorage.getItem('token');
    
    if (!token) return null;
    
    // Handle JSON-stringified tokens (from useLocalStorage hook)
    // If token starts with a quote, it's been JSON.stringified
    if (token.startsWith('"') && token.endsWith('"')) {
      try {
        token = JSON.parse(token);
      } catch (error) {
        logger.error('Failed to parse JSON-stringified token', error instanceof Error ? error : new Error('Parse error'));
        return null;
      }
    }
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development' && token) {
      logger.debug('Token retrieved from localStorage', {
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 20) + '...',
      });
    }
    
    return token;
  }

  /**
   * Handle 401 Unauthorized responses
   * Redirects to login without clearing localStorage
   * Let AuthContext handle the cleanup to avoid conflicts with useLocalStorage
   */
  private handleUnauthorized(): void {
    if (typeof window === 'undefined') return;
    
    const rawToken = localStorage.getItem('token');
    logger.error('🔴 401 UNAUTHORIZED DETECTED!', new Error('Token invalid or expired'), {
      currentPath: window.location.pathname,
      rawToken: rawToken?.substring(0, 30) + '...',
      hasQuotes: rawToken?.startsWith('"') && rawToken?.endsWith('"'),
      timestamp: new Date().toISOString(),
    });
    
    // TEMPORARY: Disable auto-redirect to debug infinite loop
    // TODO: Re-enable after fixing token issue
    console.error('❌ 401 Unauthorized - Check console for details');
    console.error('Raw Token:', rawToken);
    console.error('Has Quotes:', rawToken?.startsWith('"') && rawToken?.endsWith('"'));
    console.error('User:', localStorage.getItem('user'));
    
    // Uncomment to re-enable redirect after debugging
    // window.location.href = '/login';
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

      // Backend wraps response in { success, message, data }
      // Extract the actual data from the wrapper
      return { data: data.data || data };
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
