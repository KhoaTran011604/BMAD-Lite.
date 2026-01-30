/**
 * Parishioners Queries
 *
 * React Query hooks for fetching parishioner data.
 */

'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { queryKeys, type ParishionerFilters } from '../keys';
import type {
  PaginatedResponse,
  ParishionersListResponse,
  ApiResponse,
  ParishionerResponse,
  ApiError,
} from '@/types/api.types';

/**
 * Fetch all parishioners with pagination and filters
 */
export function useParishioners(
  filters?: ParishionerFilters,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<ParishionersListResponse>, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<PaginatedResponse<ParishionersListResponse>, ApiError>({
    queryKey: queryKeys.parishioners.list(filters),
    queryFn: () =>
      apiClient.get<PaginatedResponse<ParishionersListResponse>>('/parishioners', {
        params: filters as Record<string, string | number | boolean | undefined>,
      }),
    ...options,
  });
}

/**
 * Fetch single parishioner by ID
 */
export function useParishioner(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<{ parishioner: ParishionerResponse }>, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<ApiResponse<{ parishioner: ParishionerResponse }>, ApiError>({
    queryKey: queryKeys.parishioners.detail(id),
    queryFn: () =>
      apiClient.get<ApiResponse<{ parishioner: ParishionerResponse }>>(
        `/parishioners/${id}`
      ),
    enabled: !!id,
    ...options,
  });
}
