import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { verifyCredentials } from './credentials';

/**
 * NextAuth.js configuration
 * Uses Credentials provider with JWT strategy
 * Note: In Next.js 16, proxy.ts runs on Node.js runtime (not Edge)
 * so mongoose/bcrypt imports are supported
 */
export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await verifyCredentials(
          credentials.email as string,
          credentials.password as string
        );

        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.roleName = user.roleName;
        token.permissions = user.permissions;
        token.parish = user.parish;
        token.parishName = user.parishName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.roleName = token.roleName as string;
        session.user.permissions = token.permissions as string[];
        session.user.parish = token.parish as string | undefined;
        session.user.parishName = token.parishName as string | undefined;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnLogin = nextUrl.pathname === '/login';

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
      }
      return true;
    },
  },
};
