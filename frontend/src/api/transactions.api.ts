import apiClient from './client';
import type { TransactionResponse, TransferRequest } from '../types/transaction.types';

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export const transactionsApi = {
  getByAccount: async (
    accountNumber: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedResponse<TransactionResponse>> => {
    const response = await apiClient.get<PaginatedResponse<TransactionResponse>>(
      '/api/v1/transactions',
      { params: { accountNumber, page, size } }
    );
    return response.data;
  },

  transfer: async (data: TransferRequest): Promise<TransactionResponse> => {
    const response = await apiClient.post<TransactionResponse>('/api/v1/transactions/transfer', data);
    return response.data;
  },
};
