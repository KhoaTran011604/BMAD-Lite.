import { describe, it, expect } from 'vitest';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getPermissionsForRole,
  roleHasPermission,
  getRoutePermissions,
  canAccessRoute,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  UserRole,
} from '@/lib/auth/permissions';

describe('Permission Utilities', () => {
  describe('hasPermission', () => {
    it('should return true when user has the permission', () => {
      const userPermissions = ['users.read', 'users.write', 'parishes.read'];
      expect(hasPermission(userPermissions, 'users.read')).toBe(true);
    });

    it('should return false when user does not have the permission', () => {
      const userPermissions = ['users.read', 'parishes.read'];
      expect(hasPermission(userPermissions, 'users.write')).toBe(false);
    });

    it('should return false when userPermissions is undefined', () => {
      expect(hasPermission(undefined, 'users.read')).toBe(false);
    });

    it('should return false when userPermissions is empty', () => {
      expect(hasPermission([], 'users.read')).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true when user has at least one permission', () => {
      const userPermissions = ['users.read', 'parishes.read'];
      expect(hasAnyPermission(userPermissions, ['users.write', 'users.read'])).toBe(true);
    });

    it('should return false when user has none of the permissions', () => {
      const userPermissions = ['parishes.read'];
      expect(hasAnyPermission(userPermissions, ['users.write', 'users.read'])).toBe(false);
    });

    it('should return false when userPermissions is undefined', () => {
      expect(hasAnyPermission(undefined, ['users.read'])).toBe(false);
    });

    it('should return false when userPermissions is empty', () => {
      expect(hasAnyPermission([], ['users.read'])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true when user has all permissions', () => {
      const userPermissions = ['users.read', 'users.write', 'parishes.read'];
      expect(hasAllPermissions(userPermissions, ['users.read', 'users.write'])).toBe(true);
    });

    it('should return false when user is missing one permission', () => {
      const userPermissions = ['users.read', 'parishes.read'];
      expect(hasAllPermissions(userPermissions, ['users.read', 'users.write'])).toBe(false);
    });

    it('should return false when userPermissions is undefined', () => {
      expect(hasAllPermissions(undefined, ['users.read'])).toBe(false);
    });

    it('should return true for empty required permissions', () => {
      const userPermissions = ['users.read'];
      expect(hasAllPermissions(userPermissions, [])).toBe(true);
    });
  });

  describe('getPermissionsForRole', () => {
    it('should return all permissions for SUPER_ADMIN', () => {
      const permissions = getPermissionsForRole(UserRole.SUPER_ADMIN);
      expect(permissions).toEqual(Object.values(PERMISSIONS));
    });

    it('should return correct permissions for DIOCESE_MANAGER', () => {
      const permissions = getPermissionsForRole(UserRole.DIOCESE_MANAGER);
      expect(permissions).toContain(PERMISSIONS.PARISHES_READ);
      expect(permissions).toContain(PERMISSIONS.PARISHES_WRITE);
      expect(permissions).toContain(PERMISSIONS.TRANSACTIONS_APPROVE);
      expect(permissions).not.toContain(PERMISSIONS.USERS_READ);
      expect(permissions).not.toContain(PERMISSIONS.AUDIT_LOGS_READ);
    });

    it('should return correct permissions for PARISH_PRIEST', () => {
      const permissions = getPermissionsForRole(UserRole.PARISH_PRIEST);
      expect(permissions).toContain(PERMISSIONS.PARISHES_READ);
      expect(permissions).toContain(PERMISSIONS.PARISHIONERS_READ);
      expect(permissions).toContain(PERMISSIONS.PARISHIONERS_WRITE);
      expect(permissions).not.toContain(PERMISSIONS.TRANSACTIONS_APPROVE);
    });

    it('should return correct permissions for ACCOUNTANT', () => {
      const permissions = getPermissionsForRole(UserRole.ACCOUNTANT);
      expect(permissions).toContain(PERMISSIONS.PAYROLLS_READ);
      expect(permissions).toContain(PERMISSIONS.PAYROLLS_MANAGE);
      expect(permissions).not.toContain(PERMISSIONS.PARISHIONERS_WRITE);
    });

    it('should return correct permissions for PARISH_SECRETARY', () => {
      const permissions = getPermissionsForRole(UserRole.PARISH_SECRETARY);
      expect(permissions).toContain(PERMISSIONS.PARISHIONERS_READ);
      expect(permissions).toContain(PERMISSIONS.PARISHIONERS_WRITE);
      expect(permissions).not.toContain(PERMISSIONS.PAYROLLS_READ);
    });
  });

  describe('roleHasPermission', () => {
    it('should return true for SUPER_ADMIN with any permission', () => {
      expect(roleHasPermission(UserRole.SUPER_ADMIN, PERMISSIONS.USERS_READ)).toBe(true);
      expect(roleHasPermission(UserRole.SUPER_ADMIN, PERMISSIONS.AUDIT_LOGS_READ)).toBe(true);
    });

    it('should return false for ACCOUNTANT with users.read', () => {
      expect(roleHasPermission(UserRole.ACCOUNTANT, PERMISSIONS.USERS_READ)).toBe(false);
    });

    it('should return true for ACCOUNTANT with payrolls.manage', () => {
      expect(roleHasPermission(UserRole.ACCOUNTANT, PERMISSIONS.PAYROLLS_MANAGE)).toBe(true);
    });
  });
});

describe('Route Permission Utilities', () => {
  describe('getRoutePermissions', () => {
    it('should return permissions for exact route match', () => {
      const permissions = getRoutePermissions('/dashboard/system/users');
      expect(permissions).toContain(PERMISSIONS.USERS_READ);
    });

    it('should return permissions for prefix match', () => {
      const permissions = getRoutePermissions('/dashboard/system/users/123');
      expect(permissions).toContain(PERMISSIONS.USERS_READ);
    });

    it('should return empty array for dashboard home', () => {
      const permissions = getRoutePermissions('/dashboard');
      expect(permissions).toEqual([]);
    });

    it('should return empty array for unknown routes', () => {
      const permissions = getRoutePermissions('/dashboard/unknown');
      expect(permissions).toEqual([]);
    });

    it('should return correct permissions for finance routes', () => {
      const permissions = getRoutePermissions('/dashboard/finance/transactions');
      expect(permissions).toContain(PERMISSIONS.TRANSACTIONS_READ);
    });

    it('should return correct permissions for audit logs', () => {
      const permissions = getRoutePermissions('/dashboard/system/audit-logs');
      expect(permissions).toContain(PERMISSIONS.AUDIT_LOGS_READ);
    });
  });

  describe('canAccessRoute', () => {
    it('should allow access to dashboard home for any authenticated user', () => {
      expect(canAccessRoute(['parishes.read'], '/dashboard')).toBe(true);
    });

    it('should allow access when user has required permission', () => {
      expect(canAccessRoute([PERMISSIONS.USERS_READ], '/dashboard/system/users')).toBe(true);
    });

    it('should deny access when user lacks required permission', () => {
      expect(canAccessRoute([PERMISSIONS.PARISHES_READ], '/dashboard/system/users')).toBe(false);
    });

    it('should deny access when userPermissions is undefined', () => {
      expect(canAccessRoute(undefined, '/dashboard/system/users')).toBe(false);
    });

    it('should allow Super Admin access to all routes', () => {
      const superAdminPermissions = Object.values(PERMISSIONS);
      expect(canAccessRoute(superAdminPermissions, '/dashboard/system/users')).toBe(true);
      expect(canAccessRoute(superAdminPermissions, '/dashboard/system/audit-logs')).toBe(true);
      expect(canAccessRoute(superAdminPermissions, '/dashboard/finance/transactions')).toBe(true);
    });

    it('should allow access to sub-routes when parent permission is granted', () => {
      expect(canAccessRoute([PERMISSIONS.USERS_READ], '/dashboard/system/users/123/edit')).toBe(true);
    });
  });
});

describe('PERMISSIONS constant', () => {
  it('should have all expected permission codes', () => {
    expect(PERMISSIONS.USERS_READ).toBe('users.read');
    expect(PERMISSIONS.USERS_WRITE).toBe('users.write');
    expect(PERMISSIONS.PARISHES_READ).toBe('parishes.read');
    expect(PERMISSIONS.TRANSACTIONS_CREATE).toBe('transactions.create');
    expect(PERMISSIONS.TRANSACTIONS_APPROVE).toBe('transactions.approve');
    expect(PERMISSIONS.PAYROLLS_MANAGE).toBe('payrolls.manage');
    expect(PERMISSIONS.AUDIT_LOGS_READ).toBe('audit-logs.read');
  });
});

describe('ROLE_PERMISSIONS mapping', () => {
  it('should have all 5 roles defined', () => {
    expect(Object.keys(ROLE_PERMISSIONS)).toHaveLength(5);
    expect(ROLE_PERMISSIONS[UserRole.SUPER_ADMIN]).toBeDefined();
    expect(ROLE_PERMISSIONS[UserRole.DIOCESE_MANAGER]).toBeDefined();
    expect(ROLE_PERMISSIONS[UserRole.PARISH_PRIEST]).toBeDefined();
    expect(ROLE_PERMISSIONS[UserRole.ACCOUNTANT]).toBeDefined();
    expect(ROLE_PERMISSIONS[UserRole.PARISH_SECRETARY]).toBeDefined();
  });

  it('should give SUPER_ADMIN all permissions', () => {
    const allPermissions = Object.values(PERMISSIONS);
    expect(ROLE_PERMISSIONS[UserRole.SUPER_ADMIN]).toEqual(allPermissions);
  });

  it('should restrict audit-logs.read to SUPER_ADMIN only', () => {
    expect(ROLE_PERMISSIONS[UserRole.SUPER_ADMIN]).toContain(PERMISSIONS.AUDIT_LOGS_READ);
    expect(ROLE_PERMISSIONS[UserRole.DIOCESE_MANAGER]).not.toContain(PERMISSIONS.AUDIT_LOGS_READ);
    expect(ROLE_PERMISSIONS[UserRole.PARISH_PRIEST]).not.toContain(PERMISSIONS.AUDIT_LOGS_READ);
    expect(ROLE_PERMISSIONS[UserRole.ACCOUNTANT]).not.toContain(PERMISSIONS.AUDIT_LOGS_READ);
    expect(ROLE_PERMISSIONS[UserRole.PARISH_SECRETARY]).not.toContain(PERMISSIONS.AUDIT_LOGS_READ);
  });
});
