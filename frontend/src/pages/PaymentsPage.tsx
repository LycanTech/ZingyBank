import React, { useState } from 'react';
import { Receipt } from 'lucide-react';
import { useUserAccounts } from '@/hooks/useAccounts';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { PaymentList } from '@/components/payments/PaymentList';
import { Select } from '@/components/ui/Select';
import { ACCOUNT_TYPE_LABELS } from '@/utils/constants';

const PaymentsPage: React.FC = () => {
  const { data: accounts } = useUserAccounts();
  const [activeTab, setActiveTab] = useState<'make' | 'history'>('make');
  const [selectedAccount, setSelectedAccount] = useState('');

  const accountOptions = (accounts ?? []).map((acc) => ({
    value: acc.accountNumber,
    label: `${ACCOUNT_TYPE_LABELS[acc.accountType] || acc.accountType} (****${acc.accountNumber.slice(-4)})`,
  }));

  const firstAccountNumber = accounts?.[0]?.accountNumber ?? '';
  const historyAccount = selectedAccount || firstAccountNumber;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bank-text">Payments</h1>
        <p className="text-sm text-bank-muted mt-0.5">Make payments and view payment history</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 max-w-xs">
        <button
          onClick={() => setActiveTab('make')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'make'
              ? 'bg-white text-bank-text shadow-sm'
              : 'text-bank-muted hover:text-bank-text'
          }`}
        >
          Make Payment
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-white text-bank-text shadow-sm'
              : 'text-bank-muted hover:text-bank-text'
          }`}
        >
          History
        </button>
      </div>

      {activeTab === 'make' && (
        <div className="max-w-xl">
          <div className="bg-white rounded-xl border border-bank-border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-zingy-50 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-zingy-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-bank-text">New Payment</h2>
                <p className="text-xs text-bank-muted">Fill in the payment details</p>
              </div>
            </div>
            <PaymentForm />
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {accountOptions.length > 1 && (
            <div className="max-w-xs">
              <Select
                label="Filter by Account"
                options={accountOptions}
                value={historyAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
              />
            </div>
          )}
          {historyAccount && <PaymentList accountNumber={historyAccount} />}
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
