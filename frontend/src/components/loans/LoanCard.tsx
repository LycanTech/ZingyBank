import React from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import { LOAN_TYPE_LABELS } from '@/utils/constants';
import { Badge } from '@/components/ui/Badge';
import type { LoanResponse } from '@/types/loan.types';

interface LoanCardProps {
  loan: LoanResponse;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan }) => {
  const paidAmount = loan.principalAmount - loan.outstandingBalance;
  const paidPercentage = loan.principalAmount > 0
    ? Math.min(100, Math.round((paidAmount / loan.principalAmount) * 100))
    : 0;

  return (
    <div className="bg-white rounded-xl border border-bank-border shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-bank-text">
            {LOAN_TYPE_LABELS[loan.loanType] || loan.loanType} Loan
          </p>
          <p className="text-xs text-bank-muted font-mono mt-0.5">{loan.loanNumber}</p>
        </div>
        <Badge status={loan.status.toLowerCase()}>
          {loan.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-bank-muted">Principal</p>
          <p className="text-sm font-semibold text-bank-text">{formatCurrency(loan.principalAmount)}</p>
        </div>
        <div>
          <p className="text-xs text-bank-muted">Interest Rate</p>
          <p className="text-sm font-semibold text-bank-text">{loan.interestRate}% APR</p>
        </div>
        <div>
          <p className="text-xs text-bank-muted">Term</p>
          <p className="text-sm font-semibold text-bank-text">{loan.termMonths} months</p>
        </div>
        <div>
          <p className="text-xs text-bank-muted">Monthly Payment</p>
          <p className="text-sm font-semibold text-bank-text">{formatCurrency(loan.monthlyPayment)}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-bank-muted">Outstanding Balance</p>
          <p className="text-xs font-medium text-bank-text">{formatCurrency(loan.outstandingBalance)}</p>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-zingy-600 rounded-full transition-all duration-500"
            style={{ width: `${paidPercentage}%` }}
          />
        </div>
        <p className="text-xs text-bank-muted mt-1">{paidPercentage}% paid off</p>
      </div>
    </div>
  );
};
