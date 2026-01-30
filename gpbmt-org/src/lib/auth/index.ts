export { auth, signIn, signOut, handlers } from './auth';
export { authConfig } from './auth.config';
export { verifyCredentials } from './credentials';
export type { SessionUser } from './credentials';

// Permission utilities
export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getPermissionsForRole,
  roleHasPermission,
  canAccessRoute,
  getRoutePermissions,
  ROUTE_PERMISSIONS,
} from './permissions';

// Re-export permission constants
export { PERMISSIONS, ROLE_PERMISSIONS, UserRole } from './permissions';

// RBAC middleware for API routes
export {
  withAuth,
  withPermission,
  withAllPermissions,
  withParishScope,
  getAuthenticatedUser,
  canManageResource,
} from './rbac';
export type { AuthenticatedUser, AuthContext, AuthorizedHandler } from './rbac';
