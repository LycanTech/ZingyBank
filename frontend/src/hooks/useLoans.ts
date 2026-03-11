import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loansApi } from '../api/loans.api';
import { useAuthStore } from '../stores/auth.store';
import type { LoanApplicationRequest } from '../types/loan.types';

export function useUserLoans() {
  const userId = useAuthStore((state) => state.userId);

  return useQuery({
    queryKey: ['loans', userId],
    queryFn: () => loansApi.getByUserId(userId!),
    enabled: !!userId,
  });
}

export function useApplyForLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoanApplicationRequest) => loansApi.apply(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });
}
