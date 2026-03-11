import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response, variables) => {
      setAuth({
        ...response,
        email: variables.email,
        firstName: '',
      });
      navigate('/dashboard');
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response, variables) => {
      setAuth({
        ...response,
        email: variables.email,
        firstName: variables.firstName,
      });
      navigate('/dashboard');
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authApi.logout(refreshToken ?? ''),
    onSettled: () => {
      logout();
      navigate('/login');
    },
  });
}
