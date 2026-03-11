import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import type { TransferRequest } from '../types/transaction.types';

export function useAccountTransactions(accountNumber: string, page: number = 0, size: number = 20) {
  return useQuery({
    queryKey: ['transactions', accountNumber, page, size],
    queryFn: () => transactionsApi.getByAccount(accountNumber, page, size),
    enabled: !!accountNumber,
  });
}

export function useTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferRequest) => transactionsApi.transfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}
