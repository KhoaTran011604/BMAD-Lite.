import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { usePermissions } from '@/hooks/use-permissions';
import { PERMISSIONS } from '@/lib/auth/permissions';

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

describe('usePermissions Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      vi.mocked(useSession).mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: vi.fn(),
      });
    });

    it('should return empty permissions', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.permissions).toEqual([]);
    });

    it('should return isAuthenticated as false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should return isSuperAdmin as false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.isSuperAdmin).toBe(false);
    });

    it('should return can() as false for any permission', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.can(PERMISSIONS.USERS_READ)).toBe(false);
    });
  });

  describe('when session is loading', () => {
    beforeEach(() => {
      vi.mocked(useSession).mockReturnValue({
        data: null,
        status: 'loading',
        update: vi.fn(),
      });
    });

    it('should return isLoading as true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.isLoading).toBe(true);
    });

    it('should return isAuthenticated as false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('when user is Super Admin', () => {
    beforeEach(() => {
      vi.mocked(useSession).mockReturnValue({
        data: {
          user: {
            id: '1',
            email: 'admin@test.com',
            name: 'Super Admin',
            role: 'role-id',
            roleName: 'SUPER_ADMIN',
            permissions: Object.values(PERMISSIONS),
            parish: undefined,
            parishName: undefined,
          },
          expires: '2099-01-01',
        },
        status: 'authenticated',
        update: vi.fn(),
      });
    });

    it('should return isSuperAdmin as true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.isSuperAdmin).toBe(true);
    });

    it('should return all permissions', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.permissions).toEqual(Object.values(PERMISSIONS));
    });

    it('should return can() as true for any permission', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.can(PERMISSIONS.USERS_READ)).toBe(true);
      expect(result.current.can(PERMISSIONS.AUDIT_LOGS_READ)).toBe(true);
    });

    it('should return isParishScoped as false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.isParishScoped).toBe(false);
    });
  });

  describe('when user is Parish Priest', () => {
    const parishPriestPermissions = [
      PERMISSIONS.PARISHES_READ,
      PERMISSIONS.PARISHIONERS_READ,
      PERMISSIONS.PARISHIONERS_WRITE,
      PERMISSIONS.TRANSACTIONS_READ,
      PERMISSIONS.TRANSACTIONS_CREATE,
      PERMISSIONS.ASSETS_READ,
    ];

    beforeEach(() => {
      vi.mocked(useSession).mockReturnValue({
        data: {
          user: {
            id: '2',
            email: 'priest@test.com',
            name: 'Father John',
            role: 'role-id',
            roleName: 'PARISH_PRIEST',
            permissions: parishPriestPermissions,
            parish: 'parish-id',
            parishName: 'St. Mary Parish',
          },
          expires: '2099-01-01',
        },
        status: 'authenticated',
        update: vi.fn(),
      });
    });

    it('should return isSuperAdmin as false', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.isSuperAdmin).toBe(false);
    });

    it('should return isParishScoped as true', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.isParishScoped).toBe(true);
    });

    it('should return parish ID', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.parish).toBe('parish-id');
    });

    it('should return can() correctly for allowed permissions', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.can(PERMISSIONS.PARISHIONERS_READ)).toBe(true);
      expect(result.current.can(PERMISSIONS.PARISHIONERS_WRITE)).toBe(true);
    });

    it('should return can() as false for disallowed permissions', () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.can(PERMISSIONS.USERS_READ)).toBe(false);
      expect(result.current.can(PERMISSIONS.TRANSACTIONS_APPROVE)).toBe(false);
    });
  });

  describe('canAny function', () => {
    beforeEach(() => {
      vi.mocked(useSession).mockReturnValue({
        data: {
          user: {
            id: '3',
            email: 'acc@test.com',
            name: 'Accountant',
            role: 'role-id',
            roleName: 'ACCOUNTANT',
            permissions: [
              PERMISSIONS.PARISHES_READ,
              PERMISSIONS.TRANSACTIONS_READ,
              PERMISSIONS.TRANSACTIONS_CREATE,
              PERMISSIONS.PAYROLLS_READ,
              PERMISSIONS.PAYROLLS_MANAGE,
            ],
          },
          expires: '2099-01-01',
        },
        status: 'authenticated',
        update: vi.fn(),
      });
    });

    it('should return true when user has any of the permissions', () => {
      const { result } = renderHook(() => usePermissions());
      expect(
        result.current.canAny([PERMISSIONS.USERS_READ, PERMISSIONS.PAYROLLS_READ])
      ).toBe(true);
    });

    it('should return false when user has none of the permissions', () => {
      const { result } = renderHook(() => usePermissions());
      expect(
        result.current.canAny([PERMISSIONS.USERS_READ, PERMISSIONS.USERS_WRITE])
      ).toBe(false);
    });
  });

  describe('canAll function', () => {
    beforeEach(() => {
      vi.mocked(useSession).mockReturnValue({
        data: {
          user: {
            id: '4',
            email: 'manager@test.com',
            name: 'Diocese Manager',
            role: 'role-id',
            roleName: 'DIOCESE_MANAGER',
            permissions: [
              PERMISSIONS.PARISHES_READ,
              PERMISSIONS.PARISHES_WRITE,
              PERMISSIONS.TRANSACTIONS_READ,
              PERMISSIONS.TRANSACTIONS_CREATE,
              PERMISSIONS.TRANSACTIONS_APPROVE,
            ],
          },
          expires: '2099-01-01',
        },
        status: 'authenticated',
        update: vi.fn(),
      });
    });

    it('should return true when user has all permissions', () => {
      const { result } = renderHook(() => usePermissions());
      expect(
        result.current.canAll([PERMISSIONS.PARISHES_READ, PERMISSIONS.PARISHES_WRITE])
      ).toBe(true);
    });

    it('should return false when user is missing one permission', () => {
      const { result } = renderHook(() => usePermissions());
      expect(
        result.current.canAll([PERMISSIONS.PARISHES_READ, PERMISSIONS.USERS_READ])
      ).toBe(false);
    });
  });
});
