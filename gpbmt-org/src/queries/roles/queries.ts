/**
 * Roles Queries
 *
 * React Query hooks for fetching role data.
 */

'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { queryKeys, type RoleFilters } from '../keys';
import type { ApiResponse, RolesListResponse, ApiError } from '@/types/api.types';

/**
 * Fetch all roles
 */
export function useRoles(
  filters?: RoleFilters,
  options?: Omit<
    UseQueryOptions<ApiResponse<RolesListResponse>, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<ApiResponse<RolesListResponse>, ApiError>({
    queryKey: queryKeys.roles.list(filters),
    queryFn: () =>
      apiClient.get<ApiResponse<RolesListResponse>>('/roles', {
        params: filters as Record<string, string | number | boolean | undefined>,
      }),
    ...options,
  });
}
