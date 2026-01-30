/**
 * User Queries
 *
 * React Query hooks for fetching user data.
 */

'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { queryKeys } from '../keys';
import type { UserFilters } from '@/lib/validations/user.schema';
import type {
  ApiResponse,
  PaginatedResponse,
  UsersListResponse,
  UserDetailResponse,
  ApiError,
} from '@/types/api.types';

/**
 * Fetch users list with filters and pagination
 */
export function useUsers(
  filters?: UserFilters,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<UsersListResponse>, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<PaginatedResponse<UsersListResponse>, ApiError>({
    queryKey: queryKeys.users.list(filters),
    queryFn: () =>
      apiClient.get<PaginatedResponse<UsersListResponse>>('/users', {
        params: filters as Record<string, string | number | boolean | undefined>,
      }),
    ...options,
  });
}

/**
 * Fetch single user by ID
 */
export function useUser(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<UserDetailResponse>, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<ApiResponse<UserDetailResponse>, ApiError>({
    queryKey: queryKeys.users.detail(id),
    queryFn: () =>
      apiClient.get<ApiResponse<UserDetailResponse>>(`/users/${id}`),
    enabled: !!id,
    ...options,
  });
}
