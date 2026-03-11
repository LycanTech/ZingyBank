import React from 'react';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import type { AccountResponse } from '@/types/account.types';

interface AccountSummaryBarProps {
  accounts: AccountResponse[];
}

export const AccountSummaryBar: React.FC<AccountSummaryBarProps> = ({ accounts }) => {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="bg-white rounded-xl border border-bank-border shadow-sm overflow-hidden">
      <div className="flex items-center gap-6 px-6 py-5 border-l-4 border-l-zingy-600">
        <div className="flex-1">
          <p className="text-sm font-medium text-bank-muted mb-1">Total Balance</p>
          <p className="text-3xl font-bold text-bank-text">{formatCurrency(totalBalance)}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-green-50 text-success px-3 py-1.5 rounded-full text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          <span>+2.4%</span>
        </div>
      </div>
    </div>
  );
};
