import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '../api/accounts.api';
import { useAuthStore } from '../stores/auth.store';
import type { CreateAccountRequest } from '../types/account.types';

export function useUserAccounts() {
  const userId = useAuthStore((state) => state.userId);

  return useQuery({
    queryKey: ['accounts', 'user', userId],
    queryFn: () => accountsApi.getByUserId(userId!),
    enabled: !!userId,
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountRequest) => accountsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}
