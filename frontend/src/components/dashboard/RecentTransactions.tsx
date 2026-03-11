import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { useAccountTransactions } from '@/hooks/useTransactions';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import type { AccountResponse } from '@/types/account.types';
import type { TransactionResponse } from '@/types/transaction.types';

interface RecentTransactionsProps {
  accounts: AccountResponse[];
}

const SAMPLE_TRANSACTIONS: Partial<TransactionResponse>[] = [
  { id: 's1', type: 'DEPOSIT', description: 'Payroll Deposit', amount: 3250.0, status: 'COMPLETED', createdAt: new Date().toISOString() },
  { id: 's2', type: 'PAYMENT', description: 'Electric Company', amount: 142.50, status: 'COMPLETED', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 's3', type: 'TRANSFER', description: 'Transfer to Savings', amount: 500.0, status: 'COMPLETED', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 's4', type: 'WITHDRAWAL', description: 'ATM Withdrawal', amount: 200.0, status: 'COMPLETED', createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: 's5', type: 'DEPOSIT', description: 'Refund - Online Store', amount: 49.99, status: 'COMPLETED', createdAt: new Date(Date.now() - 345600000).toISOString() },
];

function getTransactionIcon(type: string) {
  switch (type) {
    case 'DEPOSIT':
    case 'INTEREST':
    case 'REFUND':
      return { icon: ArrowDownLeft, color: 'text-success bg-green-50' };
    case 'WITHDRAWAL':
    case 'PAYMENT':
    case 'FEE':
      return { icon: ArrowUpRight, color: 'text-danger bg-red-50' };
    case 'TRANSFER':
      return { icon: ArrowLeftRight, color: 'text-blue-600 bg-blue-50' };
    default:
      return { icon: ArrowUpRight, color: 'text-bank-muted bg-gray-50' };
  }
}

function isCredit(type: string) {
  return ['DEPOSIT', 'INTEREST', 'REFUND'].includes(type);
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ accounts }) => {
  const primaryAccount = accounts[0];
  const { data: transactionData } = useAccountTransactions(
    primaryAccount?.accountNumber ?? '',
    0,
    5
  );

  const transactions =
    transactionData?.content && transactionData.content.length > 0
      ? transactionData.content.slice(0, 5)
      : (SAMPLE_TRANSACTIONS as TransactionResponse[]);

  const usingSample = !transactionData?.content || transactionData.content.length === 0;

  return (
    <div className="bg-white rounded-xl border border-bank-border shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-bank-border">
        <h3 className="text-lg font-semibold text-bank-text">Recent Transactions</h3>
        {!usingSample && (
          <Link
            to="/accounts"
            className="text-sm text-zingy-600 font-medium hover:text-zingy-700 transition-colors"
          >
            View All
          </Link>
        )}
      </div>

      <div className="divide-y divide-bank-border">
        {transactions.map((txn) => {
          const { icon: Icon, color } = getTransactionIcon(txn.type);
          const credit = isCredit(txn.type);

          return (
            <div key={txn.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-bank-text truncate">
                  {txn.description}
                </p>
                <p className="text-xs text-bank-muted">{formatDate(txn.createdAt)}</p>
              </div>
              <span
                className={`text-sm font-semibold whitespace-nowrap ${
                  credit ? 'text-success' : 'text-danger'
                }`}
              >
                {credit ? '+' : '-'}{formatCurrency(txn.amount)}
              </span>
            </div>
          );
        })}
      </div>

      {usingSample && (
        <div className="px-5 py-3 bg-gray-50 border-t border-bank-border">
          <p className="text-xs text-bank-muted text-center">
            Sample data shown. Make your first transaction to see real activity.
          </p>
        </div>
      )}
    </div>
  );
};
