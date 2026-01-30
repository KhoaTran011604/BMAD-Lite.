# Query Keys Pattern

## Keys Factory Example (transactions/keys.ts)
```typescript
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: TransactionFilters) => [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  pending: () => [...transactionKeys.all, 'pending'] as const,
};
```

## Queries Example (transactions/queries.ts)
```typescript
import { useQuery } from '@tanstack/react-query';
import { transactionKeys } from './keys';
import { apiClient } from '@/lib/api/client';

export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => apiClient.get('/transactions', { params: filters }),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => apiClient.get(`/transactions/${id}`),
    enabled: !!id,
  });
}
```

## Mutations Example (transactions/mutations.ts)
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionKeys } from './keys';
import { fundKeys } from '../funds/keys';
import { apiClient } from '@/lib/api/client';

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionInput) =>
      apiClient.post('/transactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}

export function useApproveTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.patch(`/transactions/${id}/approve`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fundKeys.all });
    },
  });
}
```
