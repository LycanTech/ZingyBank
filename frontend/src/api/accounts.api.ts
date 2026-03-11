import apiClient from './client';
import type { AccountResponse, CreateAccountRequest } from '../types/account.types';

export const accountsApi = {
  getByUserId: async (userId: string): Promise<AccountResponse[]> => {
    const response = await apiClient.get<AccountResponse[]>(`/api/v1/accounts/user/${userId}`);
    return response.data;
  },

  getById: async (id: string): Promise<AccountResponse> => {
    const response = await apiClient.get<AccountResponse>(`/api/v1/accounts/${id}`);
    return response.data;
  },

  create: async (data: CreateAccountRequest): Promise<AccountResponse> => {
    const response = await apiClient.post<AccountResponse>('/api/v1/accounts', data);
    return response.data;
  },
};
