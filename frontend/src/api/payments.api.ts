import apiClient from './client';
import type { PaymentResponse, CreatePaymentRequest } from '../types/payment.types';

export const paymentsApi = {
  getByAccount: async (accountNumber: string): Promise<PaymentResponse[]> => {
    const response = await apiClient.get<PaymentResponse[]>('/api/v1/payments', {
      params: { accountNumber },
    });
    return response.data;
  },

  create: async (data: CreatePaymentRequest): Promise<PaymentResponse> => {
    const response = await apiClient.post<PaymentResponse>('/api/v1/payments', data);
    return response.data;
  },
};
