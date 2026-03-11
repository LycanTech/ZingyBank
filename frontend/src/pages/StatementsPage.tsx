import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useUserAccounts } from '@/hooks/useAccounts';
import { useAccountStatements, useDownloadStatement } from '@/hooks/useStatements';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { ACCOUNT_TYPE_LABELS } from '@/utils/constants';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

const StatementsPage: React.FC = () => {
  const { data: accounts } = useUserAccounts();
  const [selectedAccount, setSelectedAccount] = useState('');

  const firstAccountNumber = accounts?.[0]?.accountNumber ?? '';
  const activeAccount = selectedAccount || firstAccountNumber;

  const { data: statements, isLoading } = useAccountStatements(activeAccount);
  const downloadStatement = useDownloadStatement();

  const accountOptions = (accounts ?? []).map((acc) => ({
    value: acc.accountNumber,
    label: `${ACCOUNT_TYPE_LABELS[acc.accountType] || acc.accountType} (****${acc.accountNumber.slice(-4)})`,
  }));

  const handleDownload = (id: string) => {
    downloadStatement.mutate(id, {
      onError: () => {
        toast.error('Failed to download statement. Please try again.');
      },
    });
    toast.info('Downloading statement...');
  };

  const columns = [
    {
      key: 'period',
      header: 'Period',
      render: (item: Record<string, unknown>) => (
        <span className="text-sm font-medium">
          {formatDate(item.periodStart as string)} - {formatDate(item.periodEnd as string)}
        </span>
      ),
    },
    {
      key: 'openingBalance',
      header: 'Opening Balance',
      render: (item: Record<string, unknown>) => (
        <span>{formatCurrency(item.openingBalance as number)}</span>
      ),
    },
    {
      key: 'closingBalance',
      header: 'Closing Balance',
      render: (item: Record<string, unknown>) => (
        <span className="font-semibold">{formatCurrency(item.closingBalance as number)}</span>
      ),
    },
    {
      key: 'transactionCount',
      header: 'Transactions',
      render: (item: Record<string, unknown>) => (
        <span>{item.transactionCount as number}</span>
      ),
    },
    {
      key: 'generatedAt',
      header: 'Generated',
      render: (item: Record<string, unknown>) => (
        <span className="text-xs">{formatDate(item.generatedAt as string)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (item: Record<string, unknown>) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleDownload(item.id as string)}
        >
          <Download className="w-4 h-4 mr-1" />
          PDF
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bank-text">Statements</h1>
        <p className="text-sm text-bank-muted mt-0.5">View and download your account statements</p>
      </div>

      {accountOptions.length > 0 && (
        <div className="max-w-xs">
          <Select
            label="Account"
            options={accountOptions}
            value={activeAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          />
        </div>
      )}

      {!activeAccount ? (
        <EmptyState
          icon={<FileText className="w-12 h-12 text-zingy-400" />}
          title="No accounts"
          description="Open an account first to view statements."
        />
      ) : (
        <div className="bg-white rounded-xl border border-bank-border shadow-sm">
          <Table
            columns={columns}
            data={(statements ?? []) as unknown as Record<string, unknown>[]}
            loading={isLoading}
            emptyMessage="No statements available for this account yet."
          />
        </div>
      )}
    </div>
  );
};

export default StatementsPage;
