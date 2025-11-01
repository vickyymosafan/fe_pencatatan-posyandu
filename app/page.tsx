/**
 * Root Page
 * Redirects authenticated users to their dashboard
 * Redirects unauthenticated users to login
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { Role } from '@/types';

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth check to complete
    if (isLoading) return;

    if (isAuthenticated && user) {
      // Redirect to appropriate dashboard based on role
      const dashboardUrl =
        user.role === Role.ADMIN ? '/admin/dashboard' : '/petugas/dashboard';
      router.push(dashboardUrl);
    } else {
      // Redirect to login
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading state while checking auth
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-800 mx-auto mb-4"></div>
        <p className="text-neutral-600 text-lg">Memuat...</p>
      </div>
    </div>
  );
}
