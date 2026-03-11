import apiClient from './client';
import type { StatementResponse } from '../types/statement.types';

export const statementsApi = {
  getByAccount: async (accountNumber: string): Promise<StatementResponse[]> => {
    const response = await apiClient.get<StatementResponse[]>('/api/v1/statements', {
      params: { accountNumber },
    });
    return response.data;
  },

  download: async (id: string): Promise<Blob> => {
    const response = await apiClient.get<Blob>(`/api/v1/statements/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
