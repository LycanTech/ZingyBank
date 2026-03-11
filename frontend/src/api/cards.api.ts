import apiClient from './client';
import type { CardResponse, IssueCardRequest } from '../types/card.types';

export const cardsApi = {
  getByUserId: async (userId: string): Promise<CardResponse[]> => {
    const response = await apiClient.get<CardResponse[]>('/api/v1/cards', {
      params: { userId },
    });
    return response.data;
  },

  issue: async (data: IssueCardRequest): Promise<CardResponse> => {
    const response = await apiClient.post<CardResponse>('/api/v1/cards', data);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<CardResponse> => {
    const response = await apiClient.patch<CardResponse>(`/api/v1/cards/${id}/status`, { status });
    return response.data;
  },

  toggleFeature: async (id: string, feature: string, enabled: boolean): Promise<CardResponse> => {
    const response = await apiClient.patch<CardResponse>(`/api/v1/cards/${id}/features`, {
      feature,
      enabled,
    });
    return response.data;
  },
};
