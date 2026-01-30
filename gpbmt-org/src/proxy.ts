import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

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
export const proxy = auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - Public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
