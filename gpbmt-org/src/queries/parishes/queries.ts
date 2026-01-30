/**
 * Parishes Queries
 *
 * React Query hooks for fetching parish data.
 */

'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { queryKeys, type ParishFilters } from '../keys';
import type {
  ApiResponse,
  ParishesListResponse,
  ApiError,
} from '@/types/api.types';

/**
 * Fetch all parishes
 */
export function useParishes(
  filters?: ParishFilters,
  options?: Omit<
    UseQueryOptions<ApiResponse<ParishesListResponse>, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<ApiResponse<ParishesListResponse>, ApiError>({
    queryKey: queryKeys.parishes.list(filters),
    queryFn: () =>
      apiClient.get<ApiResponse<ParishesListResponse>>('/parishes', {
        params: filters as Record<string, string | number | boolean | undefined>,
      }),
    ...options,
  });
}
