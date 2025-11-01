/**
 * Error Boundary Component
 * Catches React rendering errors and displays fallback UI
 * Prevents entire app from crashing due to component errors
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/utils/logger';
import { getUserFriendlyMessage } from '@/lib/utils/errorMessages';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Wraps components to catch and handle rendering errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when error is caught
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details when error is caught
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console and logging service
    logger.error('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    });

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset error state
   */
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Reload the page
   */
  private handleReload = (): void => {
    window.location.reload();
  };

  /**
   * Render fallback UI when error occurs
   */
  private renderFallback(): ReactNode {
    const { fallback } = this.props;
    const { error } = this.state;

    // Use custom fallback if provided
    if (fallback) {
      return fallback;
    }

    // Get user-friendly error message
    const errorMessage = error 
      ? getUserFriendlyMessage(error, 'Terjadi kesalahan saat memuat halaman')
      : 'Terjadi kesalahan yang tidak diketahui';

    // Default fallback UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
        <Card className="max-w-md w-full">
          <div className="text-center space-y-4">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h2 className="text-2xl font-semibold text-neutral-900">
              Terjadi Kesalahan
            </h2>

            {/* Error Message */}
            <p className="text-neutral-600">
              {errorMessage}
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && error && (
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700">
                  Detail Error (Development)
                </summary>
                <pre className="mt-2 p-3 bg-neutral-100 rounded-lg text-xs overflow-auto max-h-40">
                  {error.toString()}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={this.handleReset}
                className="w-full sm:w-auto"
              >
                Coba Lagi
              </Button>
              <Button
                variant="secondary"
                onClick={this.handleReload}
                className="w-full sm:w-auto"
              >
                Refresh Halaman
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-sm text-neutral-500">
              Jika masalah berlanjut, silakan hubungi administrator sistem.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}
