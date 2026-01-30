/**
 * User Mutations
 *
 * React Query mutation hooks for user operations.
 * All mutations use callbacks pattern - no inline toast/messages.
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { queryKeys } from '../keys';
import type {
  CreateUserInput,
  UpdateUserInput,
} from '@/lib/validations/user.schema';
import type {
  ApiResponse,
  UserDetailResponse,
  ResetPasswordResponse,
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
 * Create a new user
 */
export function useCreateUser(
  callbacks?: MutationCallbacks<
    ApiResponse<UserDetailResponse>,
    CreateUserInput
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UserDetailResponse>,
    ApiError,
    CreateUserInput
  >({
    mutationFn: (data) =>
      apiClient.post<ApiResponse<UserDetailResponse>>('/users', data),
    onSuccess: (data, variables) => {
      // Invalidate user lists to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      // Call success callback
      callbacks?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      callbacks?.onError?.(error, variables);
    },
  });
}

/**
 * Update an existing user
 */
export function useUpdateUser(
  callbacks?: MutationCallbacks<
    ApiResponse<UserDetailResponse>,
    { id: string; data: UpdateUserInput }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UserDetailResponse>,
    ApiError,
    { id: string; data: UpdateUserInput }
  >({
    mutationFn: ({ id, data }) =>
      apiClient.patch<ApiResponse<UserDetailResponse>>(`/users/${id}`, data),
    onSuccess: (data, variables) => {
      // Invalidate specific user and lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      callbacks?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      callbacks?.onError?.(error, variables);
    },
  });
}

/**
 * Deactivate a user (soft delete)
 */
export function useDeactivateUser(
  callbacks?: MutationCallbacks<ApiResponse<UserDetailResponse>, string>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<UserDetailResponse>, ApiError, string>({
    mutationFn: (id) =>
      apiClient.delete<ApiResponse<UserDetailResponse>>(`/users/${id}`),
    onSuccess: (data, id) => {
      // Invalidate specific user and lists
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      callbacks?.onSuccess?.(data, id);
    },
    onError: (error, id) => {
      callbacks?.onError?.(error, id);
    },
  });
}

/**
 * Activate a user
 */
export function useActivateUser(
  callbacks?: MutationCallbacks<ApiResponse<UserDetailResponse>, string>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<UserDetailResponse>, ApiError, string>({
    mutationFn: (id) =>
      apiClient.patch<ApiResponse<UserDetailResponse>>(`/users/${id}`, {
        isActive: true,
      }),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      callbacks?.onSuccess?.(data, id);
    },
    onError: (error, id) => {
      callbacks?.onError?.(error, id);
    },
  });
}

/**
 * Reset user password
 */
export function useResetPassword(
  callbacks?: MutationCallbacks<
    ApiResponse<ResetPasswordResponse>,
    { id: string; newPassword?: string }
  >
) {
  return useMutation<
    ApiResponse<ResetPasswordResponse>,
    ApiError,
    { id: string; newPassword?: string }
  >({
    mutationFn: ({ id, newPassword }) =>
      apiClient.post<ApiResponse<ResetPasswordResponse>>(
        `/users/${id}/reset-password`,
        newPassword ? { newPassword } : undefined
      ),
    onSuccess: (data, variables) => {
      callbacks?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      callbacks?.onError?.(error, variables);
    },
  });
}

/**
 * Assign role to user
 */
export function useAssignRole(
  callbacks?: MutationCallbacks<
    ApiResponse<UserDetailResponse>,
    { userId: string; roleId: string }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UserDetailResponse>,
    ApiError,
    { userId: string; roleId: string }
  >({
    mutationFn: ({ userId, roleId }) =>
      apiClient.patch<ApiResponse<UserDetailResponse>>(
        `/users/${userId}/role`,
        { roleId }
      ),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      callbacks?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      callbacks?.onError?.(error, variables);
    },
  });
}
