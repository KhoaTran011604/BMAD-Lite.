/**
 * RBAC Middleware for API Routes
 *
 * Provides Higher-Order Functions (HOFs) for protecting API routes
 * with permission-based access control.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import { hasAnyPermission, hasAllPermissions } from './permissions';

/**
 * Structured error response for API
 */
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

/**
 * Create an error response
 */
function createErrorResponse(
  code: string,
  message: string,
  status: number
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: { code, message },
    },
    { status }
  );
}

/**
 * Extended user type from session with permissions and parish context
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  roleName: string;
  permissions: string[];
  parish?: string;
  parishName?: string;
}

/**
 * Context passed to authorized handlers
 */
export interface AuthContext {
  user: AuthenticatedUser;
  params: Record<string, string | string[]>;
}

/**
 * Handler type for authorized API routes
 */
export type AuthorizedHandler = (
  req: NextRequest,
  context: AuthContext
) => Promise<NextResponse> | NextResponse;

/**
 * Check if user is authenticated
 * Returns the user if authenticated, null otherwise
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name: session.user.name ?? '',
    role: session.user.role,
    roleName: session.user.roleName,
    permissions: session.user.permissions ?? [],
    parish: session.user.parish,
    parishName: session.user.parishName,
  };
}

/**
 * Higher-Order Function to require authentication
 * Returns 401 if not authenticated
 *
 * @param handler - The handler to execute if authenticated
 * @returns Wrapped handler with authentication check
 *
 * @example
 * export const GET = withAuth(async (req, { user }) => {
 *   return NextResponse.json({ user: user.name });
 * });
 */
export function withAuth(handler: AuthorizedHandler) {
  return async (
    req: NextRequest,
    context: { params: Promise<Record<string, string | string[]>> }
  ): Promise<NextResponse> => {
    const user = await getAuthenticatedUser();

    if (!user) {
      return createErrorResponse('UNAUTHORIZED', 'Chưa đăng nhập', 401);
    }

    const params = await context.params;
    return handler(req, { user, params });
  };
}

/**
 * Higher-Order Function to require specific permission(s)
 * Returns 401 if not authenticated, 403 if not authorized
 *
 * @param permissions - Single permission or array of permissions (OR logic - any one)
 * @param handler - The handler to execute if authorized
 * @returns Wrapped handler with permission check
 *
 * @example
 * // Single permission
 * export const GET = withPermission('users.read', async (req, { user }) => {
 *   return NextResponse.json({ users: [] });
 * });
 *
 * // Multiple permissions (user needs ANY one of them)
 * export const POST = withPermission(
 *   ['transactions.create', 'transactions.approve'],
 *   async (req, { user }) => {
 *     return NextResponse.json({ created: true });
 *   }
 * );
 */
export function withPermission(
  permissions: string | string[],
  handler: AuthorizedHandler
) {
  return async (
    req: NextRequest,
    context: { params: Promise<Record<string, string | string[]>> }
  ): Promise<NextResponse> => {
    const user = await getAuthenticatedUser();

    if (!user) {
      return createErrorResponse('UNAUTHORIZED', 'Chưa đăng nhập', 401);
    }

    const requiredPermissions = Array.isArray(permissions)
      ? permissions
      : [permissions];
    const hasAccess = hasAnyPermission(user.permissions, requiredPermissions);

    if (!hasAccess) {
      return createErrorResponse('FORBIDDEN', 'Không có quyền truy cập', 403);
    }

    const params = await context.params;
    return handler(req, { user, params });
  };
}

/**
 * Higher-Order Function to require ALL specified permissions
 * Returns 401 if not authenticated, 403 if not authorized
 *
 * @param permissions - Array of permissions (AND logic - must have all)
 * @param handler - The handler to execute if authorized
 * @returns Wrapped handler with all permissions check
 *
 * @example
 * // User must have BOTH permissions
 * export const DELETE = withAllPermissions(
 *   ['users.write', 'users.delete'],
 *   async (req, { user }) => {
 *     return NextResponse.json({ deleted: true });
 *   }
 * );
 */
export function withAllPermissions(
  permissions: string[],
  handler: AuthorizedHandler
) {
  return async (
    req: NextRequest,
    context: { params: Promise<Record<string, string | string[]>> }
  ): Promise<NextResponse> => {
    const user = await getAuthenticatedUser();

    if (!user) {
      return createErrorResponse('UNAUTHORIZED', 'Chưa đăng nhập', 401);
    }

    const hasAccess = hasAllPermissions(user.permissions, permissions);

    if (!hasAccess) {
      return createErrorResponse('FORBIDDEN', 'Không có quyền truy cập', 403);
    }

    const params = await context.params;
    return handler(req, { user, params });
  };
}

/**
 * Higher-Order Function for parish-scoped permissions
 * Adds parish context filtering for Parish Priest and Parish Secretary roles
 *
 * @param permissions - Required permissions
 * @param handler - The handler to execute if authorized
 * @returns Wrapped handler with parish scope
 *
 * @example
 * export const GET = withParishScope('parishioners.read', async (req, { user }) => {
 *   // user.parish contains the parish ID for filtering
 *   const parishioners = await Parishioner.find(
 *     user.parish ? { parish: user.parish } : {}
 *   );
 *   return NextResponse.json({ parishioners });
 * });
 */
export function withParishScope(
  permissions: string | string[],
  handler: AuthorizedHandler
) {
  return withPermission(permissions, async (req, context) => {
    // Parish Priest and Parish Secretary are limited to their assigned parish
    const parishScopedRoles = ['PARISH_PRIEST', 'PARISH_SECRETARY'];

    if (parishScopedRoles.includes(context.user.roleName) && !context.user.parish) {
      return createErrorResponse(
        'FORBIDDEN',
        'Tài khoản chưa được gán giáo xứ',
        403
      );
    }

    return handler(req, context);
  });
}

/**
 * Check if user has permission to manage a specific resource
 * Useful for update/delete operations where ownership matters
 *
 * @param user - The authenticated user
 * @param resourceOwnerId - The owner ID of the resource
 * @param adminPermission - Permission that allows managing any resource
 * @returns true if user can manage the resource
 */
export function canManageResource(
  user: AuthenticatedUser,
  resourceOwnerId: string,
  adminPermission: string
): boolean {
  // User can manage their own resources
  if (user.id === resourceOwnerId) {
    return true;
  }

  // Or if they have the admin permission
  return user.permissions.includes(adminPermission);
}
