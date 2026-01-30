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
  PaginatedResponse,
  ParishesListResponse,
  ApiResponse,
  ParishDetailResponse,
  ParishFullResponse,
  ApiError,
} from '@/types/api.types';

/**
 * Fetch all parishes with pagination
 */
export function useParishes(
  filters?: ParishFilters,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<ParishesListResponse>, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<PaginatedResponse<ParishesListResponse>, ApiError>({
    queryKey: queryKeys.parishes.list(filters),
    queryFn: () =>
      apiClient.get<PaginatedResponse<ParishesListResponse>>('/parishes', {
        params: filters as Record<string, string | number | boolean | undefined>,
      }),
    ...options,
  });
}

/**
 * Fetch single parish by ID
 */
export function useParish(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<{ parish: ParishFullResponse }>, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<ApiResponse<{ parish: ParishFullResponse }>, ApiError>({
    queryKey: queryKeys.parishes.detail(id),
    queryFn: () =>
      apiClient.get<ApiResponse<{ parish: ParishFullResponse }>>(
        `/parishes/${id}`
      ),
    enabled: !!id,
    ...options,
  });
}
