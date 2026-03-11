import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsApi } from '../api/cards.api';
import { useAuthStore } from '../stores/auth.store';
import type { IssueCardRequest } from '../types/card.types';

export function useUserCards() {
  const userId = useAuthStore((state) => state.userId);

  return useQuery({
    queryKey: ['cards', userId],
    queryFn: () => cardsApi.getByUserId(userId!),
    enabled: !!userId,
  });
}

export function useIssueCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IssueCardRequest) => cardsApi.issue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useUpdateCardStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      cardsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useToggleCardFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, feature, enabled }: { id: string; feature: string; enabled: boolean }) =>
      cardsApi.toggleFeature(id, feature, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}
