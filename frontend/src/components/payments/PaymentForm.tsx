import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { DollarSign } from 'lucide-react';
import { useUserAccounts } from '@/hooks/useAccounts';
import { useCreatePayment } from '@/hooks/usePayments';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ACCOUNT_TYPE_LABELS } from '@/utils/constants';

const paymentSchema = z.object({
  accountNumber: z.string().min(1, 'Source account is required'),
  payeeName: z.string().min(1, 'Payee name is required'),
  payeeAccountNumber: z.string().min(1, 'Payee account number is required'),
  paymentType: z.string().min(1, 'Payment type is required'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive('Amount must be greater than 0')),
  scheduledDate: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
});

type PaymentFormData = z.input<typeof paymentSchema>;

interface PaymentFormProps {
  onSuccess?: () => void;
}

const paymentTypeOptions = [
  { value: 'BILL_PAYMENT', label: 'Bill Payment' },
  { value: 'UTILITY_PAYMENT', label: 'Utility Payment' },
  { value: 'MORTGAGE_PAYMENT', label: 'Mortgage Payment' },
  { value: 'INSURANCE_PAYMENT', label: 'Insurance Payment' },
  { value: 'TAX_PAYMENT', label: 'Tax Payment' },
  { value: 'SUBSCRIPTION', label: 'Subscription' },
  { value: 'OTHER', label: 'Other' },
];

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess }) => {
  const { data: accounts } = useUserAccounts();
  const createPayment = useCreatePayment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      accountNumber: '',
      payeeName: '',
      payeeAccountNumber: '',
      paymentType: 'BILL_PAYMENT',
      amount: '',
      scheduledDate: '',
      description: '',
    },
  });

  const accountOptions = (accounts ?? []).map((acc) => ({
    value: acc.accountNumber,
    label: `${ACCOUNT_TYPE_LABELS[acc.accountType] || acc.accountType} (****${acc.accountNumber.slice(-4)})`,
  }));

  const onSubmit = (data: PaymentFormData) => {
    const parsed = paymentSchema.parse(data);
    createPayment.mutate(
      {
        accountNumber: parsed.accountNumber,
        payeeName: parsed.payeeName,
        payeeAccountNumber: parsed.payeeAccountNumber,
        amount: parsed.amount,
        currency: 'USD',
        paymentType: parsed.paymentType as any,
        scheduledDate: parsed.scheduledDate || undefined,
        description: parsed.description,
      },
      {
        onSuccess: () => {
          toast.success('Payment submitted successfully!');
          reset();
          onSuccess?.();
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : 'Payment failed. Please try again.';
          toast.error(message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="From Account"
        options={[{ value: '', label: 'Select account' }, ...accountOptions]}
        error={errors.accountNumber?.message}
        {...register('accountNumber')}
      />

      <Input
        label="Payee Name"
        placeholder="e.g., Electric Company"
        error={errors.payeeName?.message}
        {...register('payeeName')}
      />

      <Input
        label="Payee Account Number"
        placeholder="Enter payee account number"
        error={errors.payeeAccountNumber?.message}
        {...register('payeeAccountNumber')}
      />

      <Select
        label="Payment Type"
        options={paymentTypeOptions}
        error={errors.paymentType?.message}
        {...register('paymentType')}
      />

      <Input
        label="Amount"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        icon={<DollarSign className="w-5 h-5" />}
        error={errors.amount?.message}
        {...register('amount')}
      />

      <Input
        label="Schedule Date (Optional)"
        type="date"
        error={errors.scheduledDate?.message}
        {...register('scheduledDate')}
      />

      <Input
        label="Description"
        placeholder="Payment description"
        error={errors.description?.message}
        {...register('description')}
      />

      <Button type="submit" className="w-full" size="lg" loading={createPayment.isPending}>
        Submit Payment
      </Button>
    </form>
  );
};
