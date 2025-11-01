/**
 * Global Error Page
 * Catches errors in the root layout
 * This is a Next.js convention file for handling errors in root layout
 */

'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/utils/logger';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Component
 * Displayed when an error occurs in the root layout
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error when component mounts
    logger.error('Global Error (Root Layout)', error, {
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="id">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
          <div className="max-w-md w-full bg-white border border-neutral-200 rounded-xl p-6 shadow-lg">
            <div className="text-center space-y-4">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
              <p className="text-neutral-600">
                Aplikasi mengalami kesalahan yang tidak terduga. Silakan refresh halaman atau hubungi administrator.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-900 transition-colors"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition-colors"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
