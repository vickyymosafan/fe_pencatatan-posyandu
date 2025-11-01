/**
 * Auth Guard Component
 * Client-side authentication guard for protected pages
 * Provides additional layer of protection beyond middleware
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { Role } from '@/types';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: Role;
  fallbackUrl?: string;
}

/**
 * AuthGuard Component
 * Wraps protected content and redirects if not authenticated
 * 
 * @example
 * <AuthGuard requiredRole={Role.ADMIN}>
 *   <AdminDashboard />
 * </AuthGuard>
 */
export function AuthGuard({
  children,
  requiredRole,
  fallbackUrl = '/login',
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth check to complete
    if (isLoading) return;

    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push(fallbackUrl);
      return;
    }

    // Check role if required
    if (requiredRole && user?.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      const dashboardUrl =
        user?.role === Role.ADMIN ? '/admin/dashboard' : '/petugas/dashboard';
      router.push(dashboardUrl);
    }
  }, [isAuthenticated, isLoading, user, requiredRole, fallbackUrl, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-800 mx-auto mb-4"></div>
          <p className="text-neutral-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated or wrong role
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-800 mx-auto mb-4"></div>
          <p className="text-neutral-600">Mengalihkan...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
