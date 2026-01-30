import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import {
  withAuth,
  withPermission,
  withAllPermissions,
  canManageResource,
  type AuthenticatedUser,
} from '@/lib/auth/rbac';
import { PERMISSIONS } from '@/lib/auth/permissions';

// Mock the auth module
vi.mock('@/lib/auth/auth', () => ({
  auth: vi.fn(),
}));

// Import the mocked auth
import { auth } from '@/lib/auth/auth';

// Helper to create mock request
function createMockRequest(url: string = 'http://localhost:3000/api/test'): NextRequest {
  return new NextRequest(url);
}

// Helper to create mock context
function createMockContext(params: Record<string, string> = {}): { params: Promise<Record<string, string>> } {
  return {
    params: Promise.resolve(params),
  };
}

describe('RBAC Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('withAuth', () => {
    it('should return 401 when user is not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null);

      const handler = vi.fn();
      const wrappedHandler = withAuth(handler);

      const response = await wrappedHandler(createMockRequest(), createMockContext());
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
      expect(body.error.message).toBe('Chưa đăng nhập');
      expect(handler).not.toHaveBeenCalled();
    });

    it('should call handler when user is authenticated', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
          role: 'role-id',
          roleName: 'SUPER_ADMIN',
          permissions: Object.values(PERMISSIONS),
        },
        expires: '2099-01-01',
      });

      const handler = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
      const wrappedHandler = withAuth(handler);

      await wrappedHandler(createMockRequest(), createMockContext());

      expect(handler).toHaveBeenCalled();
    });

    it('should pass user and params to handler', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
          role: 'role-id',
          roleName: 'SUPER_ADMIN',
          permissions: [PERMISSIONS.USERS_READ],
        },
        expires: '2099-01-01',
      });

      const handler = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
      const wrappedHandler = withAuth(handler);

      await wrappedHandler(createMockRequest(), createMockContext({ id: '123' }));

      expect(handler).toHaveBeenCalledWith(
        expect.any(NextRequest),
        expect.objectContaining({
          user: expect.objectContaining({
            id: '1',
            email: 'test@test.com',
          }),
          params: { id: '123' },
        })
      );
    });
  });

  describe('withPermission', () => {
    it('should return 401 when user is not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null);

      const handler = vi.fn();
      const wrappedHandler = withPermission(PERMISSIONS.USERS_READ, handler);

      const response = await wrappedHandler(createMockRequest(), createMockContext());
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error.code).toBe('UNAUTHORIZED');
      expect(handler).not.toHaveBeenCalled();
    });

    it('should return 403 when user lacks permission', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
          role: 'role-id',
          roleName: 'ACCOUNTANT',
          permissions: [PERMISSIONS.PAYROLLS_READ],
        },
        expires: '2099-01-01',
      });

      const handler = vi.fn();
      const wrappedHandler = withPermission(PERMISSIONS.USERS_READ, handler);

      const response = await wrappedHandler(createMockRequest(), createMockContext());
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('FORBIDDEN');
      expect(body.error.message).toBe('Không có quyền truy cập');
      expect(handler).not.toHaveBeenCalled();
    });

    it('should call handler when user has single required permission', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
          role: 'role-id',
          roleName: 'SUPER_ADMIN',
          permissions: [PERMISSIONS.USERS_READ, PERMISSIONS.USERS_WRITE],
        },
        expires: '2099-01-01',
      });

      const handler = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
      const wrappedHandler = withPermission(PERMISSIONS.USERS_READ, handler);

      await wrappedHandler(createMockRequest(), createMockContext());

      expect(handler).toHaveBeenCalled();
    });

    it('should call handler when user has any of multiple required permissions (OR)', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
          role: 'role-id',
          roleName: 'ACCOUNTANT',
          permissions: [PERMISSIONS.PAYROLLS_MANAGE],
        },
        expires: '2099-01-01',
      });

      const handler = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
      const wrappedHandler = withPermission(
        [PERMISSIONS.USERS_READ, PERMISSIONS.PAYROLLS_MANAGE],
        handler
      );

      await wrappedHandler(createMockRequest(), createMockContext());

      expect(handler).toHaveBeenCalled();
    });

    it('should return 403 when user has none of multiple permissions', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
          role: 'role-id',
          roleName: 'PARISH_SECRETARY',
          permissions: [PERMISSIONS.PARISHES_READ],
        },
        expires: '2099-01-01',
      });

      const handler = vi.fn();
      const wrappedHandler = withPermission(
        [PERMISSIONS.USERS_READ, PERMISSIONS.PAYROLLS_MANAGE],
        handler
      );

      const response = await wrappedHandler(createMockRequest(), createMockContext());

      expect(response.status).toBe(403);
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('withAllPermissions', () => {
    it('should return 403 when user is missing one permission', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
          role: 'role-id',
          roleName: 'DIOCESE_MANAGER',
          permissions: [PERMISSIONS.USERS_READ],
        },
        expires: '2099-01-01',
      });

      const handler = vi.fn();
      const wrappedHandler = withAllPermissions(
        [PERMISSIONS.USERS_READ, PERMISSIONS.USERS_WRITE],
        handler
      );

      const response = await wrappedHandler(createMockRequest(), createMockContext());

      expect(response.status).toBe(403);
      expect(handler).not.toHaveBeenCalled();
    });

    it('should call handler when user has all permissions', async () => {
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
          role: 'role-id',
          roleName: 'SUPER_ADMIN',
          permissions: [PERMISSIONS.USERS_READ, PERMISSIONS.USERS_WRITE, PERMISSIONS.USERS_DELETE],
        },
        expires: '2099-01-01',
      });

      const handler = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
      const wrappedHandler = withAllPermissions(
        [PERMISSIONS.USERS_READ, PERMISSIONS.USERS_WRITE],
        handler
      );

      await wrappedHandler(createMockRequest(), createMockContext());

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('canManageResource', () => {
    const user: AuthenticatedUser = {
      id: 'user-123',
      email: 'test@test.com',
      name: 'Test User',
      role: 'role-id',
      roleName: 'ACCOUNTANT',
      permissions: [PERMISSIONS.TRANSACTIONS_READ],
    };

    it('should return true when user owns the resource', () => {
      expect(canManageResource(user, 'user-123', PERMISSIONS.TRANSACTIONS_DELETE)).toBe(true);
    });

    it('should return true when user has admin permission', () => {
      const adminUser: AuthenticatedUser = {
        ...user,
        permissions: [PERMISSIONS.TRANSACTIONS_DELETE],
      };
      expect(canManageResource(adminUser, 'other-user', PERMISSIONS.TRANSACTIONS_DELETE)).toBe(true);
    });

    it('should return false when user does not own and lacks permission', () => {
      expect(canManageResource(user, 'other-user', PERMISSIONS.TRANSACTIONS_DELETE)).toBe(false);
    });
  });
});
