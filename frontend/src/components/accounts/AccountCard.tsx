import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, PiggyBank, Building2, Landmark, BadgeDollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/formatCurrency';
import { ACCOUNT_TYPE_LABELS } from '@/utils/constants';
import type { AccountResponse } from '@/types/account.types';

interface AccountCardProps {
  account: AccountResponse;
}

function getAccountIcon(type: string) {
  switch (type) {
    case 'CHECKING':
    case 'BUSINESS_CHECKING':
      return Wallet;
    case 'SAVINGS':
    case 'BUSINESS_SAVINGS':
      return PiggyBank;
    case 'MONEY_MARKET':
      return Building2;
    case 'CERTIFICATE_OF_DEPOSIT':
      return Landmark;
    default:
      return BadgeDollarSign;
  }
}

export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const navigate = useNavigate();
  const Icon = getAccountIcon(account.accountType);
  const maskedNumber = `****${account.accountNumber.slice(-4)}`;
  const statusLower = account.status.toLowerCase();

  return (
    <div
      onClick={() => navigate(`/accounts/${account.id}`)}
      className="relative glass-surface rounded-2xl card-glow-hover cursor-pointer p-5 group overflow-hidden"
    >
      {/* Top shimmer line on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zingy-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Subtle tint on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-zingy-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      <div className="relative flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.07] border border-white/10 flex items-center justify-center group-hover:bg-zingy-500/20 group-hover:border-zingy-500/30 transition-all duration-200">
            <Icon className="w-4.5 h-4.5 text-zingy-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-bank-text tracking-tight">
              {ACCOUNT_TYPE_LABELS[account.accountType] || account.accountType}
            </p>
            <p className="text-xs text-bank-muted font-mono mt-0.5">{maskedNumber}</p>
          </div>
        </div>
        <Badge status={statusLower}>{account.status.replace(/_/g, ' ')}</Badge>
      </div>

      <p className="relative text-2xl font-bold gradient-text tracking-tight">{formatCurrency(account.balance)}</p>
      <p className="relative text-[10px] text-bank-muted mt-1 uppercase tracking-[0.12em]">{account.currency}</p>
    </div>
  );
};
