/**
 * Global Error Handler
 * Handles uncaught errors and unhandled promise rejections
 * Provides centralized error handling for the entire application
 */

import { logger } from './logger';
import { getUserFriendlyMessage, isNetworkError } from './errorMessages';

/**
 * Error handler callback type
 */
type ErrorCallback = (message: string, error: Error) => void;

/**
 * Global error handler class
 */
class GlobalErrorHandler {
  private errorCallback?: ErrorCallback;
  private isInitialized = false;

  /**
   * Initialize global error handlers
   * Should be called once in the application root
   */
  initialize(errorCallback?: ErrorCallback): void {
    if (this.isInitialized) {
      logger.warn('GlobalErrorHandler already initialized');
      return;
    }

    if (typeof window === 'undefined') {
      logger.warn('GlobalErrorHandler can only be initialized in browser environment');
      return;
    }

    this.errorCallback = errorCallback;

    // Handle uncaught errors
    window.addEventListener('error', this.handleError);

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);

    this.isInitialized = true;
    logger.info('GlobalErrorHandler initialized');
  }

  /**
   * Cleanup global error handlers
   */
  cleanup(): void {
    if (typeof window === 'undefined') return;

    window.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);

    this.isInitialized = false;
    logger.info('GlobalErrorHandler cleaned up');
  }

  /**
   * Handle uncaught errors
   */
  private handleError = (event: ErrorEvent): void => {
    event.preventDefault();

    const { error, message, filename, lineno, colno } = event;

    logger.error('Uncaught error', error || new Error(message), {
      filename,
      lineno,
      colno,
    });

    // Get user-friendly message
    const userMessage = getUserFriendlyMessage(
      error || message,
      'Terjadi kesalahan. Silakan refresh halaman.'
    );

    // Call error callback if provided (e.g., to show toast)
    if (this.errorCallback) {
      this.errorCallback(userMessage, error || new Error(message));
    }
  };

  /**
   * Handle unhandled promise rejections
   */
  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    event.preventDefault();

    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));

    logger.error('Unhandled promise rejection', error, {
      reason: event.reason,
    });

    // Don't show toast for network errors (already handled by API client)
    if (isNetworkError(error)) {
      return;
    }

    // Get user-friendly message
    const userMessage = getUserFriendlyMessage(
      error,
      'Terjadi kesalahan. Silakan coba lagi.'
    );

    // Call error callback if provided
    if (this.errorCallback) {
      this.errorCallback(userMessage, error);
    }
  };
}

/**
 * Singleton instance
 */
export const globalErrorHandler = new GlobalErrorHandler();
