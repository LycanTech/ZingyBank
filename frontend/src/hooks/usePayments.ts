import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '../api/payments.api';
import type { CreatePaymentRequest } from '../types/payment.types';

export function useAccountPayments(accountNumber: string) {
  return useQuery({
    queryKey: ['payments', accountNumber],
    queryFn: () => paymentsApi.getByAccount(accountNumber),
    enabled: !!accountNumber,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}
