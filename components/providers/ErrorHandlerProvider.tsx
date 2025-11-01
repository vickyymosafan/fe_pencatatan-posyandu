/**
 * Error Handler Provider
 * Initializes global error handler and integrates with toast system
 * Must be used within ToastProvider
 */

'use client';

import { useEffect } from 'react';
import { globalErrorHandler } from '@/lib/utils/globalErrorHandler';
import { useToast } from '@/lib/hooks/useToast';

/**
 * Error Handler Provider Component
 * Initializes global error handlers on mount
 */
export function ErrorHandlerProvider({ children }: { children: React.ReactNode }) {
  const { error: showErrorToast } = useToast();

  useEffect(() => {
    // Initialize global error handler with toast callback
    globalErrorHandler.initialize((message) => {
      showErrorToast(message);
    });

    // Cleanup on unmount
    return () => {
      globalErrorHandler.cleanup();
    };
  }, [showErrorToast]);

  return <>{children}</>;
}
