import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAccount } from '@/hooks/useAccounts';
import { useAccountTransactions } from '@/hooks/useTransactions';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { ACCOUNT_TYPE_LABELS, STATUS_COLORS, TRANSACTION_TYPE_LABELS } from '@/utils/constants';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Table } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';

const AccountDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: account, isLoading: accountLoading } = useAccount(id ?? '');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data: transactionData, isLoading: txnLoading } = useAccountTransactions(
    account?.accountNumber ?? '',
    page,
    pageSize
  );

  const [copied, setCopied] = useState(false);

  const handleCopyAccountNumber = () => {
    if (account) {
      navigator.clipboard.writeText(account.accountNumber);
      setCopied(true);
      toast.success('Account number copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (accountLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!account) {
    return (
      <EmptyState
        title="Account not found"
        description="The account you are looking for does not exist or has been removed."
        action={
          <Link to="/accounts">
            <Button variant="outline">Back to Accounts</Button>
          </Link>
        }
      />
    );
  }

  const statusColor = STATUS_COLORS[account.status] || '';
  const transactions = transactionData?.content ?? [];
  const totalPages = transactionData?.totalPages ?? 0;

  const transactionColumns = [
    {
      key: 'createdAt',
      header: 'Date',
      render: (txn: Record<string, unknown>) => (
        <span className="text-xs">{formatDateTime(txn.createdAt as string)}</span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (txn: Record<string, unknown>) => (
        <span className="font-medium">{txn.description as string}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (txn: Record<string, unknown>) => (
        <span className="text-xs">
          {TRANSACTION_TYPE_LABELS[txn.type as keyof typeof TRANSACTION_TYPE_LABELS] || (txn.type as string)}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (txn: Record<string, unknown>) => {
        const type = txn.type as string;
        const isCredit = ['DEPOSIT', 'INTEREST', 'REFUND'].includes(type);
        return (
          <span className={`font-semibold ${isCredit ? 'text-success' : 'text-danger'}`}>
            {isCredit ? '+' : '-'}{formatCurrency(txn.amount as number)}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (txn: Record<string, unknown>) => {
        const status = txn.status as string;
        return (
          <Badge status={status.toLowerCase()}>
            {status.replace(/_/g, ' ')}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Link
        to="/accounts"
        className="inline-flex items-center gap-1.5 text-sm text-bank-muted hover:text-bank-text transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Accounts
      </Link>

      {/* Account header */}
      <div className="bg-white rounded-xl border border-bank-border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-bank-text">
              {ACCOUNT_TYPE_LABELS[account.accountType] || account.accountType}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-bank-muted font-mono">{account.accountNumber}</span>
              <button
                onClick={handleCopyAccountNumber}
                className="text-bank-muted hover:text-bank-text transition-colors"
                title="Copy account number"
              >
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Badge status={account.status.toLowerCase()} className={statusColor}>
            {account.status.replace(/_/g, ' ')}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-bank-muted mb-1">Balance</p>
            <p className="text-xl font-bold text-bank-text">{formatCurrency(account.balance)}</p>
          </div>
          <div>
            <p className="text-xs text-bank-muted mb-1">Currency</p>
            <p className="text-sm font-medium text-bank-text">{account.currency}</p>
          </div>
          <div>
            <p className="text-xs text-bank-muted mb-1">Interest Rate</p>
            <p className="text-sm font-medium text-bank-text">{account.interestRate}%</p>
          </div>
          <div>
            <p className="text-xs text-bank-muted mb-1">Opened</p>
            <p className="text-sm font-medium text-bank-text">{formatDate(account.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl border border-bank-border shadow-sm">
        <div className="px-5 py-4 border-b border-bank-border">
          <h2 className="text-lg font-semibold text-bank-text">Transaction History</h2>
        </div>

        <Table
          columns={transactionColumns}
          data={transactions as unknown as Record<string, unknown>[]}
          loading={txnLoading}
          emptyMessage="No transactions found for this account."
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-bank-border">
            <p className="text-sm text-bank-muted">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDetailPage;
