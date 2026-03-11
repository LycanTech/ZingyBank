import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Spinner } from '@/components/ui/Spinner';

// Lazy-loaded pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const AccountsPage = lazy(() => import('@/pages/AccountsPage'));
const AccountDetailPage = lazy(() => import('@/pages/AccountDetailPage'));
const TransferPage = lazy(() => import('@/pages/TransferPage'));
const PaymentsPage = lazy(() => import('@/pages/PaymentsPage'));
const LoansPage = lazy(() => import('@/pages/LoansPage'));
const CardsPage = lazy(() => import('@/pages/CardsPage'));
const StatementsPage = lazy(() => import('@/pages/StatementsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/accounts/:id" element={<AccountDetailPage />} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/statements" element={<StatementsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
