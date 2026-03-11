import React, { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { DollarSign, Calculator } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useUserAccounts } from '@/hooks/useAccounts';
import { useApplyForLoan } from '@/hooks/useLoans';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import { ACCOUNT_TYPE_LABELS } from '@/utils/constants';

const loanApplicationSchema = z.object({
  loanType: z.string().min(1, 'Loan type is required'),
  disbursementAccountNumber: z.string().min(1, 'Disbursement account is required'),
  principalAmount: z
    .string()
    .min(1, 'Amount is required')
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive('Amount must be greater than 0')),
  termMonths: z
    .string()
    .min(1, 'Term is required')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive()),
});

type LoanApplicationFormData = z.input<typeof loanApplicationSchema>;

interface LoanApplicationFormProps {
  onSuccess?: () => void;
}

const loanTypeOptions = [
  { value: 'PERSONAL', label: 'Personal Loan' },
  { value: 'MORTGAGE', label: 'Mortgage' },
  { value: 'AUTO', label: 'Auto Loan' },
  { value: 'STUDENT', label: 'Student Loan' },
  { value: 'BUSINESS', label: 'Business Loan' },
  { value: 'HOME_EQUITY', label: 'Home Equity Loan' },
  { value: 'CREDIT_LINE', label: 'Credit Line' },
];

const termOptions = [
  { value: '12', label: '12 months (1 year)' },
  { value: '24', label: '24 months (2 years)' },
  { value: '36', label: '36 months (3 years)' },
  { value: '48', label: '48 months (4 years)' },
  { value: '60', label: '60 months (5 years)' },
];

function calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
}

export const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({ onSuccess }) => {
  const userId = useAuthStore((state) => state.userId);
  const { data: accounts } = useUserAccounts();
  const applyLoan = useApplyForLoan();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<z.input<typeof loanApplicationSchema>, unknown, z.output<typeof loanApplicationSchema>>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      loanType: 'PERSONAL',
      disbursementAccountNumber: '',
      principalAmount: '',
      termMonths: '12',
    },
  });

  const watchedAmount = useWatch({ control, name: 'principalAmount' });
  const watchedTerm = useWatch({ control, name: 'termMonths' });

  const estimatedPayment = useMemo(() => {
    const principal = parseFloat(watchedAmount || '0');
    const term = parseInt(watchedTerm || '12', 10);
    return calculateMonthlyPayment(principal, 5, term);
  }, [watchedAmount, watchedTerm]);

  const accountOptions = (accounts ?? []).map((acc) => ({
    value: acc.accountNumber,
    label: `${ACCOUNT_TYPE_LABELS[acc.accountType] || acc.accountType} (****${acc.accountNumber.slice(-4)})`,
  }));

  const onSubmit = (data: z.output<typeof loanApplicationSchema>) => {
    if (!userId) return;

    applyLoan.mutate(
      {
        userId,
        disbursementAccountNumber: data.disbursementAccountNumber,
        loanType: data.loanType as any,
        principalAmount: data.principalAmount,
        termMonths: data.termMonths,
      },
      {
        onSuccess: () => {
          toast.success('Loan application submitted successfully!');
          reset();
          onSuccess?.();
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : 'Loan application failed.';
          toast.error(message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Loan Type"
        options={loanTypeOptions}
        error={errors.loanType?.message}
        {...register('loanType')}
      />

      <Select
        label="Disbursement Account"
        options={[{ value: '', label: 'Select account' }, ...accountOptions]}
        error={errors.disbursementAccountNumber?.message}
        {...register('disbursementAccountNumber')}
      />

      <Input
        label="Loan Amount"
        type="number"
        step="0.01"
        min="1"
        placeholder="0.00"
        icon={<DollarSign className="w-5 h-5" />}
        error={errors.principalAmount?.message}
        {...register('principalAmount')}
      />

      <Select
        label="Term"
        options={termOptions}
        error={errors.termMonths?.message}
        {...register('termMonths')}
      />

      {/* Estimated monthly payment */}
      {estimatedPayment > 0 && (
        <div className="bg-zingy-50 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zingy-100 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-zingy-600" />
          </div>
          <div>
            <p className="text-xs text-bank-muted">Estimated Monthly Payment</p>
            <p className="text-lg font-bold text-zingy-700">{formatCurrency(estimatedPayment)}</p>
            <p className="text-[10px] text-bank-muted">Based on 5.0% APR estimate</p>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" loading={applyLoan.isPending}>
        Submit Application
      </Button>
    </form>
  );
};
