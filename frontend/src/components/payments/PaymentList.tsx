import React from 'react';
import { useAccountPayments } from '@/hooks/usePayments';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { PAYMENT_TYPE_LABELS } from '@/utils/constants';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import type { PaymentResponse } from '@/types/payment.types';

interface PaymentListProps {
  accountNumber: string;
}

export const PaymentList: React.FC<PaymentListProps> = ({ accountNumber }) => {
  const { data: payments, isLoading } = useAccountPayments(accountNumber);

  const columns = [
    {
      key: 'createdAt',
      header: 'Date',
      render: (item: Record<string, unknown>) => (
        <span className="text-xs">{formatDate(item.createdAt as string)}</span>
      ),
    },
    {
      key: 'payeeName',
      header: 'Payee',
      render: (item: Record<string, unknown>) => (
        <span className="font-medium">{item.payeeName as string}</span>
      ),
    },
    {
      key: 'paymentType',
      header: 'Type',
      render: (item: Record<string, unknown>) => (
        <span className="text-xs">
          {PAYMENT_TYPE_LABELS[item.paymentType as keyof typeof PAYMENT_TYPE_LABELS] || (item.paymentType as string)}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item: Record<string, unknown>) => (
        <span className="font-semibold">{formatCurrency(item.amount as number)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Record<string, unknown>) => {
        const status = item.status as string;
        return (
          <Badge status={status.toLowerCase()}>
            {status.replace(/_/g, ' ')}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-bank-border shadow-sm">
      <div className="px-5 py-4 border-b border-bank-border">
        <h3 className="text-lg font-semibold text-bank-text">Payment History</h3>
      </div>
      <Table
        columns={columns}
        data={(payments ?? []) as unknown as Record<string, unknown>[]}
        loading={isLoading}
        emptyMessage="No payments found."
      />
    </div>
  );
};
