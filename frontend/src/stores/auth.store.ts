import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse } from '../types/auth.types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  email: string | null;
  firstName: string | null;
  roles: string[];
  isAuthenticated: boolean;
  setAuth: (response: AuthResponse & { email: string; firstName: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      email: null,
      firstName: null,
      roles: [],
      isAuthenticated: false,

      setAuth: (response) =>
        set({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          userId: response.userId,
          email: response.email,
          firstName: response.firstName,
          roles: response.roles,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          email: null,
          firstName: null,
          roles: [],
          isAuthenticated: false,
        }),
    }),
    {
      name: 'zingybank-auth',
    }
  )
);
