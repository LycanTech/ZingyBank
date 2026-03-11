import apiClient from './client';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/register', data);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/api/v1/auth/logout', { refreshToken });
  },
};
