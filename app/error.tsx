/**
 * Next.js Error Page
 * Handles errors that occur during rendering
 * This is a Next.js convention file
 */

'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/utils/logger';
import { getUserFriendlyMessage } from '@/lib/utils/errorMessages';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Page Component
 * Displayed when an error occurs in the app
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error when component mounts
    logger.error('Next.js Error Page', error, {
      digest: error.digest,
    });
  }, [error]);

  // Get user-friendly error message
  const errorMessage = getUserFriendlyMessage(
    error,
    'Terjadi kesalahan saat memuat halaman'
  );

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
          <h1 className="text-2xl font-semibold text-neutral-900">
            Terjadi Kesalahan
          </h1>

          {/* Error Message */}
          <p className="text-neutral-600">{errorMessage}</p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700">
                Detail Error (Development)
              </summary>
              <pre className="mt-2 p-3 bg-neutral-100 rounded-lg text-xs overflow-auto max-h-40">
                {error.toString()}
                {error.stack && `\n\n${error.stack}`}
                {error.digest && `\n\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              onClick={reset}
              className="w-full sm:w-auto"
            >
              Coba Lagi
            </Button>
            <Button
              variant="secondary"
              onClick={() => (window.location.href = '/')}
              className="w-full sm:w-auto"
            >
              Kembali ke Beranda
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
