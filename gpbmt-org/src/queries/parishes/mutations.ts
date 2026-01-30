/**
 * Parish Mutations
 *
 * React Query mutation hooks for parish operations.
 * All mutations use callbacks pattern - no inline toast/messages.
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { queryKeys } from '../keys';
import type {
  CreateParishInput,
  UpdateParishInput,
} from '@/lib/validations/parish.schema';
import type {
  ApiResponse,
  ParishFullResponse,
  ApiError,
} from '@/types/api.types';

/**
 * Callback types for mutations
 */
interface MutationCallbacks<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: ApiError, variables: TVariables) => void;
}

/**
 * Create a new parish
 */
export function useCreateParish(
  callbacks?: MutationCallbacks<
    ApiResponse<{ parish: ParishFullResponse }>,
    CreateParishInput
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ parish: ParishFullResponse }>,
    ApiError,
    CreateParishInput
  >({
    mutationFn: (data) =>
      apiClient.post<ApiResponse<{ parish: ParishFullResponse }>>(
        '/parishes',
        data
      ),
    onSuccess: (data, variables) => {
      // Invalidate parish lists to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.parishes.lists() });
      // Call success callback
      callbacks?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      callbacks?.onError?.(error, variables);
    },
  });
}

/**
 * Update an existing parish
 */
export function useUpdateParish(
  callbacks?: MutationCallbacks<
    ApiResponse<{ parish: ParishFullResponse }>,
    { id: string; data: UpdateParishInput }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ parish: ParishFullResponse }>,
    ApiError,
    { id: string; data: UpdateParishInput }
  >({
    mutationFn: ({ id, data }) =>
      apiClient.patch<ApiResponse<{ parish: ParishFullResponse }>>(
        `/parishes/${id}`,
        data
      ),
    onSuccess: (data, variables) => {
      // Invalidate specific parish and lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.parishes.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.parishes.lists() });
      callbacks?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      callbacks?.onError?.(error, variables);
    },
  });
}

/**
 * Delete a parish
 */
export function useDeleteParish(
  callbacks?: MutationCallbacks<
    ApiResponse<{ parish: ParishFullResponse }>,
    string
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ parish: ParishFullResponse }>,
    ApiError,
    string
  >({
    mutationFn: (id) =>
      apiClient.delete<ApiResponse<{ parish: ParishFullResponse }>>(
        `/parishes/${id}`
      ),
    onSuccess: (data, id) => {
      // Invalidate specific parish and lists
      queryClient.invalidateQueries({ queryKey: queryKeys.parishes.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.parishes.lists() });
      callbacks?.onSuccess?.(data, id);
    },
    onError: (error, id) => {
      callbacks?.onError?.(error, id);
    },
  });
}

/**
 * Activate a parish
 */
export function useActivateParish(
  callbacks?: MutationCallbacks<
    ApiResponse<{ parish: ParishFullResponse }>,
    string
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ parish: ParishFullResponse }>,
    ApiError,
    string
  >({
    mutationFn: (id) =>
      apiClient.patch<ApiResponse<{ parish: ParishFullResponse }>>(
        `/parishes/${id}`,
        { isActive: true }
      ),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parishes.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.parishes.lists() });
      callbacks?.onSuccess?.(data, id);
    },
    onError: (error, id) => {
      callbacks?.onError?.(error, id);
    },
  });
}

/**
 * Deactivate a parish
 */
export function useDeactivateParish(
  callbacks?: MutationCallbacks<
    ApiResponse<{ parish: ParishFullResponse }>,
    string
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ parish: ParishFullResponse }>,
    ApiError,
    string
  >({
    mutationFn: (id) =>
      apiClient.patch<ApiResponse<{ parish: ParishFullResponse }>>(
        `/parishes/${id}`,
        { isActive: false }
      ),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parishes.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.parishes.lists() });
      callbacks?.onSuccess?.(data, id);
    },
    onError: (error, id) => {
      callbacks?.onError?.(error, id);
    },
  });
}
