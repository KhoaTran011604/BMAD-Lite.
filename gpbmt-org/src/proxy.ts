import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { canAccessRoute } from '@/lib/auth/permissions';

const { auth } = NextAuth(authConfig);

/**
 * Next.js 16 Proxy
 *
 * In Next.js 16, 'middleware.ts' is deprecated and replaced with 'proxy.ts'.
 * The proxy runs on Node.js runtime (not Edge), allowing use of:
 * - Native Node.js modules (mongoose, bcrypt, etc.)
 * - Full database connections
 * - Complex authentication logic
 *
 * Export 'proxy' instead of 'default' or 'middleware'.
 */

export const proxy = auth(async (req) => {
  const { nextUrl } = req;
  const user = req.auth?.user;
  const isLoggedIn = !!user;
  const pathname = nextUrl.pathname;

  // API routes are handled by their own middleware (RBAC)
  const isApiRoute = pathname.startsWith('/api/');

  // Dashboard routes require authentication
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Handle login page
  if (pathname === '/login') {
    if (isLoggedIn) {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }
    return;
  }

  // Handle root path
  if (pathname === '/') {
    if (isLoggedIn) {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }
    return Response.redirect(new URL('/login', nextUrl));
  }

  // Skip API routes - they have their own RBAC middleware
  if (isApiRoute) {
    return;
  }

  // Dashboard routes - require authentication
  if (isDashboardRoute) {
    // Not logged in - redirect to login
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', nextUrl);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return Response.redirect(loginUrl);
    }

    // Check route permissions
    const userPermissions = user?.permissions ?? [];
    const hasAccess = canAccessRoute(userPermissions, pathname);

    if (!hasAccess) {
      // Redirect to dashboard with error parameter
      const dashboardUrl = new URL('/dashboard', nextUrl);
      dashboardUrl.searchParams.set('error', 'permission_denied');
      dashboardUrl.searchParams.set('attempted', pathname);
      return Response.redirect(dashboardUrl);
    }

    // User has access - continue
    return;
  }

  // Allow other routes
  return;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - Public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
