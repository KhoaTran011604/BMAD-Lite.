/**
 * Permission Utilities for RBAC
 *
 * This module provides utility functions for checking user permissions.
 * Permission constants and role mappings are defined in @/types/models.types.ts
 */

import { PERMISSIONS, ROLE_PERMISSIONS, UserRole } from '@/types/models.types';

// Re-export for convenience
export { PERMISSIONS, ROLE_PERMISSIONS, UserRole };

/**
 * Check if user has a specific permission
 * @param userPermissions - Array of permission codes the user has
 * @param permission - Permission code to check
 * @returns true if user has the permission
 */
export function hasPermission(
  userPermissions: string[] | undefined,
  permission: string
): boolean {
  if (!userPermissions || userPermissions.length === 0) {
    return false;
  }
  return userPermissions.includes(permission);
}

/**
 * Check if user has ANY of the specified permissions
 * @param userPermissions - Array of permission codes the user has
 * @param permissions - Array of permission codes to check (OR logic)
 * @returns true if user has at least one of the permissions
 */
export function hasAnyPermission(
  userPermissions: string[] | undefined,
  permissions: string[]
): boolean {
  if (!userPermissions || userPermissions.length === 0) {
    return false;
  }
  return permissions.some((p) => userPermissions.includes(p));
}

/**
 * Check if user has ALL of the specified permissions
 * @param userPermissions - Array of permission codes the user has
 * @param permissions - Array of permission codes to check (AND logic)
 * @returns true if user has all of the permissions
 */
export function hasAllPermissions(
  userPermissions: string[] | undefined,
  permissions: string[]
): boolean {
  if (!userPermissions || userPermissions.length === 0) {
    return false;
  }
  return permissions.every((p) => userPermissions.includes(p));
}

/**
 * Get permissions for a specific role
 * @param role - User role enum value
 * @returns Array of permission codes for the role
 */
export function getPermissionsForRole(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a role has a specific permission
 * @param role - User role enum value
 * @param permission - Permission code to check
 * @returns true if the role has the permission
 */
export function roleHasPermission(role: UserRole, permission: string): boolean {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(permission);
}

/**
 * Route permission mapping for client-side protection
 * Maps URL patterns to required permissions
 */
export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  // User management - Super Admin only
  '/dashboard/users': [PERMISSIONS.USERS_READ],

  // Parish management
  '/dashboard/parishes': [PERMISSIONS.PARISHES_READ],

  // Parishioner management
  '/dashboard/parishioners': [PERMISSIONS.PARISHIONERS_READ],

  // Finance routes
  '/dashboard/finance': [PERMISSIONS.TRANSACTIONS_READ],
  '/dashboard/finance/transactions': [PERMISSIONS.TRANSACTIONS_READ],
  '/dashboard/finance/funds': [PERMISSIONS.TRANSACTIONS_READ],
  '/dashboard/finance/categories': [PERMISSIONS.TRANSACTIONS_READ],
  '/dashboard/finance/bank-accounts': [PERMISSIONS.TRANSACTIONS_READ],
  '/dashboard/finance/entities': [PERMISSIONS.TRANSACTIONS_READ],

  // HR routes
  '/dashboard/hr': [PERMISSIONS.PAYROLLS_READ],
  '/dashboard/hr/employees': [PERMISSIONS.PAYROLLS_READ],
  '/dashboard/hr/payrolls': [PERMISSIONS.PAYROLLS_READ],

  // Asset management
  '/dashboard/assets': [PERMISSIONS.ASSETS_READ],
  '/dashboard/administration': [PERMISSIONS.ASSETS_READ],
  '/dashboard/administration/assets': [PERMISSIONS.ASSETS_READ],
  '/dashboard/administration/rental-contracts': [PERMISSIONS.ASSETS_READ],

  // Audit logs - Super Admin only
  '/dashboard/audit-logs': [PERMISSIONS.AUDIT_LOGS_READ],
  '/dashboard/system/audit-logs': [PERMISSIONS.AUDIT_LOGS_READ],
  '/dashboard/system/users': [PERMISSIONS.USERS_READ],
};

/**
 * Get required permissions for a route
 * @param pathname - The URL pathname
 * @returns Array of required permissions, or empty array if no restriction
 */
export function getRoutePermissions(pathname: string): string[] {
  // Check exact match first
  const exactMatch = ROUTE_PERMISSIONS[pathname];
  if (exactMatch) {
    return exactMatch;
  }

  // Check for prefix matches (e.g., /dashboard/users/123 matches /dashboard/users)
  for (const route of Object.keys(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(route + '/')) {
      const prefixMatch = ROUTE_PERMISSIONS[route];
      if (prefixMatch) {
        return prefixMatch;
      }
    }
  }

  // Dashboard home is accessible to all authenticated users
  return [];
}

/**
 * Check if user can access a specific route
 * @param userPermissions - Array of permission codes the user has
 * @param pathname - The URL pathname to check
 * @returns true if user can access the route
 */
export function canAccessRoute(
  userPermissions: string[] | undefined,
  pathname: string
): boolean {
  const requiredPermissions = getRoutePermissions(pathname);

  // No permissions required for this route
  if (requiredPermissions.length === 0) {
    return true;
  }

  // Check if user has any of the required permissions
  return hasAnyPermission(userPermissions, requiredPermissions);
}
