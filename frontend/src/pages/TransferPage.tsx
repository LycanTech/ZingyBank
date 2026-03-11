import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { TransferForm } from '@/components/transactions/TransferForm';

const TransferPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bank-text">Transfer Money</h1>
        <p className="text-sm text-bank-muted mt-0.5">Send money between accounts instantly</p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-xl border border-bank-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-zingy-50 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-zingy-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-bank-text">New Transfer</h2>
              <p className="text-xs text-bank-muted">Fill in the details below</p>
            </div>
          </div>

          <TransferForm />
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
