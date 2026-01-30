/**
 * Centralized Query Keys
 *
 * Single source of truth for ALL React Query cache keys.
 * This makes cache invalidation predictable and easy to manage.
 */

import type { UserFilters } from '@/lib/validations/user.schema';

// Filter types for other domains (to be expanded)
export interface RoleFilters {
  search?: string;
}

export interface ParishFilters {
  search?: string;
  isActive?: boolean;
}

/**
 * Centralized query keys for all domains
 */
export const queryKeys = {
  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: UserFilters) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    me: () => [...queryKeys.users.all, 'me'] as const,
  },

  // ---------------------------------------------------------------------------
  // Roles
  // ---------------------------------------------------------------------------
  roles: {
    all: ['roles'] as const,
    lists: () => [...queryKeys.roles.all, 'list'] as const,
    list: (filters?: RoleFilters) =>
      [...queryKeys.roles.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.roles.all, 'detail', id] as const,
  },

  // ---------------------------------------------------------------------------
  // Parishes
  // ---------------------------------------------------------------------------
  parishes: {
    all: ['parishes'] as const,
    lists: () => [...queryKeys.parishes.all, 'list'] as const,
    list: (filters?: ParishFilters) =>
      [...queryKeys.parishes.lists(), filters] as const,
    details: () => [...queryKeys.parishes.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.parishes.details(), id] as const,
  },

  // ---------------------------------------------------------------------------
  // Transactions (placeholder for future)
  // ---------------------------------------------------------------------------
  transactions: {
    all: ['transactions'] as const,
    lists: () => [...queryKeys.transactions.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.transactions.lists(), filters] as const,
    details: () => [...queryKeys.transactions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.transactions.details(), id] as const,
    pending: () => [...queryKeys.transactions.all, 'pending'] as const,
  },

  // ---------------------------------------------------------------------------
  // Funds (placeholder for future)
  // ---------------------------------------------------------------------------
  funds: {
    all: ['funds'] as const,
    lists: () => [...queryKeys.funds.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.funds.lists(), filters] as const,
    details: () => [...queryKeys.funds.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.funds.details(), id] as const,
  },

  // ---------------------------------------------------------------------------
  // Categories (placeholder for future)
  // ---------------------------------------------------------------------------
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: (type?: 'INCOME' | 'EXPENSE') =>
      [...queryKeys.categories.lists(), type] as const,
    tree: () => [...queryKeys.categories.all, 'tree'] as const,
  },

  // ---------------------------------------------------------------------------
  // Dashboard (placeholder for future)
  // ---------------------------------------------------------------------------
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    pending: () => [...queryKeys.dashboard.all, 'pending'] as const,
  },

  // ---------------------------------------------------------------------------
  // Audit Logs (placeholder for future)
  // ---------------------------------------------------------------------------
  auditLogs: {
    all: ['auditLogs'] as const,
    lists: () => [...queryKeys.auditLogs.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.auditLogs.lists(), filters] as const,
  },
} as const;

/**
 * Type helper for query key inference
 */
export type QueryKeys = typeof queryKeys;
