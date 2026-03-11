import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { DollarSign, FileText } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useUserAccounts } from '@/hooks/useAccounts';
import { useTransfer } from '@/hooks/useTransactions';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ACCOUNT_TYPE_LABELS } from '@/utils/constants';

const transferSchema = z.object({
  sourceAccountNumber: z.string().min(1, 'Source account is required'),
  destinationAccountNumber: z
    .string()
    .min(1, 'Destination account is required')
    .regex(/^ZB\d{10,}$/, 'Account number must start with ZB followed by digits'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive('Amount must be greater than 0')),
  description: z.string().min(1, 'Description is required'),
});

type TransferFormData = z.input<typeof transferSchema>;

interface TransferFormProps {
  onSuccess?: () => void;
}

export const TransferForm: React.FC<TransferFormProps> = ({ onSuccess }) => {
  const userId = useAuthStore((state) => state.userId);
  const { data: accounts } = useUserAccounts();
  const transfer = useTransfer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      sourceAccountNumber: '',
      destinationAccountNumber: '',
      amount: '',
      description: '',
    },
  });

  const accountOptions = (accounts ?? []).map((acc) => ({
    value: acc.accountNumber,
    label: `${ACCOUNT_TYPE_LABELS[acc.accountType] || acc.accountType} (****${acc.accountNumber.slice(-4)})`,
  }));

  const onSubmit = (data: TransferFormData) => {
    const parsed = transferSchema.parse(data);
    transfer.mutate(
      {
        sourceAccountNumber: parsed.sourceAccountNumber,
        destinationAccountNumber: parsed.destinationAccountNumber,
        amount: parsed.amount,
        currency: 'USD',
        description: parsed.description,
        initiatedBy: userId ?? '',
      },
      {
        onSuccess: () => {
          toast.success('Transfer initiated successfully!');
          reset();
          onSuccess?.();
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : 'Transfer failed. Please try again.';
          toast.error(message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Select
        label="From Account"
        options={[{ value: '', label: 'Select source account' }, ...accountOptions]}
        error={errors.sourceAccountNumber?.message}
        {...register('sourceAccountNumber')}
      />

      <Input
        label="To Account Number"
        placeholder="ZBxxxxxxxxxx"
        error={errors.destinationAccountNumber?.message}
        {...register('destinationAccountNumber')}
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
        label="Description"
        placeholder="What is this transfer for?"
        icon={<FileText className="w-5 h-5" />}
        error={errors.description?.message}
        {...register('description')}
      />

      <Button type="submit" className="w-full" size="lg" loading={transfer.isPending}>
        Transfer Money
      </Button>
    </form>
  );
};
