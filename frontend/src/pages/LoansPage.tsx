import React, { useState } from 'react';
import { Landmark, Plus } from 'lucide-react';
import { useUserLoans } from '@/hooks/useLoans';
import { LoanCard } from '@/components/loans/LoanCard';
import { LoanApplicationForm } from '@/components/loans/LoanApplicationForm';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';

const LoansPage: React.FC = () => {
  const { data: loans, isLoading } = useUserLoans();
  const [showApplication, setShowApplication] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-bank-text">Loans</h1>
          <p className="text-sm text-bank-muted mt-0.5">Manage your loans and applications</p>
        </div>
        <Button onClick={() => setShowApplication(!showApplication)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Apply for Loan
        </Button>
      </div>

      {/* Application form */}
      {showApplication && (
        <div className="max-w-xl">
          <div className="bg-white rounded-xl border border-bank-border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-zingy-50 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-zingy-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-bank-text">Loan Application</h2>
                <p className="text-xs text-bank-muted">Fill in your loan details</p>
              </div>
            </div>
            <LoanApplicationForm onSuccess={() => setShowApplication(false)} />
          </div>
        </div>
      )}

      {/* Existing loans */}
      {!loans || loans.length === 0 ? (
        !showApplication && (
          <EmptyState
            icon={<Landmark className="w-12 h-12 text-zingy-400" />}
            title="No loans"
            description="You don't have any active loans. Apply for a loan to get started."
            action={
              <Button onClick={() => setShowApplication(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Apply for Loan
              </Button>
            }
          />
        )
      ) : (
        <div>
          <h2 className="text-lg font-semibold text-bank-text mb-3">Your Loans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansPage;
