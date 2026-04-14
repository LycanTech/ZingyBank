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
    <div className="bg-bank-card rounded-xl border border-bank-border overflow-hidden card-glow">
      <div className="flex items-center gap-6 px-6 py-5">
        {/* Gradient left accent */}
        <div className="w-1 self-stretch rounded-full bg-linear-to-b from-zingy-500 to-amber-500 shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-bank-muted uppercase tracking-wider mb-1">
            Total Portfolio Balance
          </p>
          <p className="text-3xl font-bold gradient-text">{formatCurrency(totalBalance)}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30 px-3 py-1.5 rounded-full text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          <span>+2.4%</span>
        </div>
      </div>
    </div>
  );
};
