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
      className="relative bg-bank-card rounded-xl border border-bank-border hover:border-zingy-800 card-glow-hover transition-all duration-200 cursor-pointer p-5 group overflow-hidden"
    >
      {/* Top gradient accent line */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl bg-linear-to-r from-zingy-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zingy-900 border border-zingy-800 flex items-center justify-center group-hover:bg-zingy-800 transition-colors">
            <Icon className="w-5 h-5 text-zingy-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-bank-text">
              {ACCOUNT_TYPE_LABELS[account.accountType] || account.accountType}
            </p>
            <p className="text-xs text-bank-muted font-mono">{maskedNumber}</p>
          </div>
        </div>
        <Badge status={statusLower}>{account.status.replace(/_/g, ' ')}</Badge>
      </div>

      <p className="text-2xl font-bold gradient-text">{formatCurrency(account.balance)}</p>
      <p className="text-xs text-bank-muted mt-1 uppercase tracking-wider">{account.currency}</p>
    </div>
  );
};
