import apiClient from './client';
import type { LoanResponse, LoanApplicationRequest } from '../types/loan.types';

export const loansApi = {
  getByUserId: async (userId: string): Promise<LoanResponse[]> => {
    const response = await apiClient.get<LoanResponse[]>('/api/v1/loans', {
      params: { userId },
    });
    return response.data;
  },

  apply: async (data: LoanApplicationRequest): Promise<LoanResponse> => {
    const response = await apiClient.post<LoanResponse>('/api/v1/loans/apply', data);
    return response.data;
  },
};
