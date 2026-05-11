import React from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useUserAccounts } from '@/hooks/useAccounts';
import { AccountSummaryBar } from '@/components/dashboard/AccountSummaryBar';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { AccountCard } from '@/components/accounts/AccountCard';
import { Spinner } from '@/components/ui/Spinner';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const DashboardPage: React.FC = () => {
  const firstName = useAuthStore((state) => state.firstName);
  const { data: accounts, isLoading } = useUserAccounts();

  if (isLoading) {
    return (
      <div className="space-y-7">
        <div className="h-9 bg-white/5 rounded-2xl w-56 animate-pulse" />
        <div className="h-28 bg-white/5 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-72 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const accountList = accounts ?? [];

  return (
    <div className="space-y-7">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold gradient-text tracking-tight">
          {getGreeting()}, {firstName || 'there'}
        </h1>
        <p className="text-sm text-bank-muted mt-1">
          Here&apos;s an overview of your accounts
        </p>
      </div>

      {/* Summary bar */}
      <AccountSummaryBar accounts={accountList} />

      {/* Account tiles */}
      {accountList.length > 0 && (
        <div>
          <h2 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.12em] mb-3">
            Your Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accountList.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <QuickActions />

      {/* Two-column: Recent transactions + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions accounts={accountList} />
        <SpendingChart />
      </div>
    </div>
  );
};

export default DashboardPage;
