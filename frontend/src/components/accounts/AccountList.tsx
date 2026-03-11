import React from 'react';
import { Plus } from 'lucide-react';
import { useUserAccounts } from '@/hooks/useAccounts';
import { AccountCard } from './AccountCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';

interface AccountListProps {
  onOpenCreate: () => void;
}

export const AccountList: React.FC<AccountListProps> = ({ onOpenCreate }) => {
  const { data: accounts, isLoading } = useUserAccounts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-bank-border shadow-sm p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
            <div className="h-7 bg-gray-200 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <EmptyState
        title="No accounts yet"
        description="Open your first account to get started with ZingyBank."
        action={
          <Button onClick={onOpenCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Open New Account
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-bank-muted">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
        <Button size="sm" onClick={onOpenCreate}>
          <Plus className="w-4 h-4 mr-1.5" />
          Open New Account
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
};
