/**
 * API Types
 *
 * Common types for API requests and responses.
 */

/**
 * Standard API success response
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      path?: string;
      message: string;
    }>;
  };
}

/**
 * Paginated response metadata
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  success: true;
  data: T;
  meta: PaginationMeta;
}

/**
 * API error class for handling errors
 */
export class ApiError extends Error {
  code: string;
  statusCode: number;
  details?: Array<{ path?: string; message: string }>;

  constructor(
    code: string,
    message: string,
    statusCode: number = 500,
    details?: Array<{ path?: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * User response from API
 */
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: {
    id: string;
    name: string;
  } | null;
  parish: {
    id: string;
    name: string;
  } | null;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Role response from API
 */
export interface RoleResponse {
  id: string;
  name: string;
  permissions?: string[];
}

/**
 * Parish response from API
 */
export interface ParishResponse {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
}

/**
 * User list response
 */
export interface UsersListResponse {
  users: UserResponse[];
}

/**
 * Single user response
 */
export interface UserDetailResponse {
  user: UserResponse;
}

/**
 * Password reset response
 */
export interface ResetPasswordResponse {
  userId: string;
  temporaryPassword: string;
  mustChangePassword: boolean;
}

/**
 * Roles list response
 */
export interface RolesListResponse {
  roles: RoleResponse[];
}

/**
 * Parishes list response
 */
export interface ParishesListResponse {
  parishes: ParishResponse[];
}

/**
 * Single parish response
 */
export interface ParishDetailResponse {
  parish: ParishResponse;
}

/**
 * Full parish response with all fields
 */
export interface ParishFullResponse {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  foundingDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
