/**
 * Next.js Middleware
 * Handles route protection and role-based access control
 * Runs on Edge runtime before page rendering
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Protected route patterns
 */
const ADMIN_ROUTES = ['/admin'];
const PETUGAS_ROUTES = ['/petugas'];
const PUBLIC_ROUTES = ['/login', '/'];

/**
 * Check if path matches any of the route patterns
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

/**
 * Middleware function
 * Protects routes based on authentication and role
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth cookies
  const authCookie = request.cookies.get('auth');
  const roleCookie = request.cookies.get('role');

  const isAuthenticated = authCookie?.value === 'true';
  const userRole = roleCookie?.value;

  // Allow public routes
  if (matchesRoute(pathname, PUBLIC_ROUTES)) {
    // If authenticated and trying to access login, redirect to dashboard
    if (pathname === '/login' && isAuthenticated) {
      const dashboardUrl =
        userRole === 'ADMIN' ? '/admin/dashboard' : '/petugas/dashboard';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
    return NextResponse.next();
  }

  // Check if accessing protected routes
  const isAdminRoute = matchesRoute(pathname, ADMIN_ROUTES);
  const isPetugasRoute = matchesRoute(pathname, PETUGAS_ROUTES);

  // Redirect to login if not authenticated
  if (!isAuthenticated && (isAdminRoute || isPetugasRoute)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  if (isAuthenticated) {
    // Admin trying to access Petugas routes
    if (userRole === 'ADMIN' && isPetugasRoute) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Petugas trying to access Admin routes
    if (userRole === 'PETUGAS' && isAdminRoute) {
      return NextResponse.redirect(new URL('/petugas/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Middleware configuration
 * Specify which routes should run the middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
