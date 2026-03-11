import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

export const ProtectedRoute: React.FC = () => {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
