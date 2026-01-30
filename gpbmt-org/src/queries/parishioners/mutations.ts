/**
 * Parishioner Mutations
 *
 * React Query mutation hooks for parishioner operations.
 * All mutations use callbacks pattern - no inline toast/messages.
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { queryKeys } from '../keys';
import type {
  CreateParishionerInput,
  UpdateParishionerInput,
} from '@/lib/validations/parishioner.schema';
import type {
  ApiResponse,
  ParishionerResponse,
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
 * Create a new parishioner
 */
export function useCreateParishioner(
  callbacks?: MutationCallbacks<
    ApiResponse<{ parishioner: ParishionerResponse }>,
    CreateParishionerInput
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ parishioner: ParishionerResponse }>,
    ApiError,
    CreateParishionerInput
  >({
    mutationFn: (data) =>
      apiClient.post<ApiResponse<{ parishioner: ParishionerResponse }>>(
        '/parishioners',
        data
      ),
    onSuccess: (data, variables) => {
      // Invalidate parishioner lists to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.parishioners.lists() });
      // Call success callback
      callbacks?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      callbacks?.onError?.(error, variables);
    },
  });
}

/**
 * Update an existing parishioner
 */
export function useUpdateParishioner(
  callbacks?: MutationCallbacks<
    ApiResponse<{ parishioner: ParishionerResponse }>,
    { id: string; data: UpdateParishionerInput }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ parishioner: ParishionerResponse }>,
    ApiError,
    { id: string; data: UpdateParishionerInput }
  >({
    mutationFn: ({ id, data }) =>
      apiClient.patch<ApiResponse<{ parishioner: ParishionerResponse }>>(
        `/parishioners/${id}`,
        data
      ),
    onSuccess: (data, variables) => {
      // Invalidate specific parishioner and lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.parishioners.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.parishioners.lists() });
      callbacks?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      callbacks?.onError?.(error, variables);
    },
  });
}

/**
 * Delete a parishioner
 */
export function useDeleteParishioner(
  callbacks?: MutationCallbacks<
    ApiResponse<{ parishioner: ParishionerResponse }>,
    string
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ parishioner: ParishionerResponse }>,
    ApiError,
    string
  >({
    mutationFn: (id) =>
      apiClient.delete<ApiResponse<{ parishioner: ParishionerResponse }>>(
        `/parishioners/${id}`
      ),
    onSuccess: (data, id) => {
      // Invalidate specific parishioner and lists
      queryClient.invalidateQueries({ queryKey: queryKeys.parishioners.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.parishioners.lists() });
      callbacks?.onSuccess?.(data, id);
    },
    onError: (error, id) => {
      callbacks?.onError?.(error, id);
    },
  });
}
