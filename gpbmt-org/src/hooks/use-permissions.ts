'use client';

/**
 * usePermissions Hook
 *
 * Provides permission checking utilities for client-side components.
 * Uses the current session to check user permissions.
 */

import { useSession } from 'next-auth/react';
import { useMemo, useCallback } from 'react';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/auth/permissions';

interface UsePermissionsReturn {
  /** User's permission array */
  permissions: string[];
  /** User's role name (e.g., SUPER_ADMIN) */
  roleName: string | undefined;
  /** User's parish ID (if assigned) */
  parish: string | undefined;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether session is loading */
  isLoading: boolean;
  /** Check if user has a specific permission */
  can: (permission: string) => boolean;
  /** Check if user has ANY of the specified permissions */
  canAny: (permissions: string[]) => boolean;
  /** Check if user has ALL of the specified permissions */
  canAll: (permissions: string[]) => boolean;
  /** Check if user is Super Admin */
  isSuperAdmin: boolean;
  /** Check if user's role is parish-scoped (Parish Priest or Parish Secretary) */
  isParishScoped: boolean;
}

/**
 * Hook to check user permissions in client components
 *
 * @returns Permission checking utilities
 *
 * @example
 * function MyComponent() {
 *   const { can, canAny, isSuperAdmin } = usePermissions();
 *
 *   if (!can('users.read')) {
 *     return null;
 *   }
 *
 *   return (
 *     <div>
 *       {canAny(['transactions.create', 'transactions.approve']) && (
 *         <Button>Create Transaction</Button>
 *       )}
 *       {isSuperAdmin && <AdminPanel />}
 *     </div>
 *   );
 * }
 */
export function usePermissions(): UsePermissionsReturn {
  const { data: session, status } = useSession();

  const permissions = useMemo(() => {
    return session?.user?.permissions ?? [];
  }, [session?.user?.permissions]);

  const roleName = session?.user?.roleName;
  const parish = session?.user?.parish;

  const can = useCallback(
    (permission: string): boolean => {
      return hasPermission(permissions, permission);
    },
    [permissions]
  );

  const canAny = useCallback(
    (perms: string[]): boolean => {
      return hasAnyPermission(permissions, perms);
    },
    [permissions]
  );

  const canAll = useCallback(
    (perms: string[]): boolean => {
      return hasAllPermissions(permissions, perms);
    },
    [permissions]
  );

  const isSuperAdmin = roleName === 'SUPER_ADMIN';

  const isParishScoped = useMemo(() => {
    return roleName === 'PARISH_PRIEST' || roleName === 'PARISH_SECRETARY';
  }, [roleName]);

  return {
    permissions,
    roleName,
    parish,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    can,
    canAny,
    canAll,
    isSuperAdmin,
    isParishScoped,
  };
}
