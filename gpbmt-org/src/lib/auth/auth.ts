import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

/**
 * NextAuth.js instance with handlers and auth functions
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
