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
    <div className="relative rounded-2xl overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 apple-aurora-bg opacity-60" />
      <div className="absolute inset-0 bg-zingy-950/70" />

      {/* Top shimmer */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zingy-400/50 to-transparent" />

      {/* Glass overlay */}
      <div className="absolute inset-0 glass-surface rounded-2xl" />

      <div className="relative flex items-center justify-between px-8 py-7">
        <div>
          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.14em] mb-2">
            Total Portfolio Balance
          </p>
          <p className="text-4xl font-bold text-white tracking-tight">
            {formatCurrency(totalBalance)}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-success/15 text-success ring-1 ring-success/25 px-3.5 py-2 rounded-full text-sm font-semibold">
          <TrendingUp className="w-4 h-4" />
          <span>+2.4%</span>
        </div>
      </div>
    </div>
  );
};
