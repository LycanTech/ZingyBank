import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import { useCreateAccount } from '@/hooks/useAccounts';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const createAccountSchema = z.object({
  accountType: z.string().min(1, 'Account type is required'),
  currency: z.string().min(1, 'Currency is required'),
  initialDeposit: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .pipe(z.number().min(0, 'Deposit must be positive').optional()),
});

type CreateAccountFormData = z.input<typeof createAccountSchema>;

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const accountTypeOptions = [
  { value: 'CHECKING', label: 'Checking' },
  { value: 'SAVINGS', label: 'Savings' },
  { value: 'MONEY_MARKET', label: 'Money Market' },
  { value: 'CERTIFICATE_OF_DEPOSIT', label: 'Certificate of Deposit' },
  { value: 'BUSINESS_CHECKING', label: 'Business Checking' },
  { value: 'BUSINESS_SAVINGS', label: 'Business Savings' },
];

const currencyOptions = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
];

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({ isOpen, onClose }) => {
  const userId = useAuthStore((state) => state.userId);
  const createAccount = useCreateAccount();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      accountType: 'CHECKING',
      currency: 'USD',
      initialDeposit: '',
    },
  });

  const onSubmit = (data: CreateAccountFormData) => {
    if (!userId) return;

    const parsed = createAccountSchema.parse(data);
    createAccount.mutate(
      {
        userId,
        accountType: parsed.accountType as CreateAccountFormData['accountType'] extends string ? any : never,
        currency: parsed.currency,
        initialDeposit: parsed.initialDeposit,
      },
      {
        onSuccess: () => {
          toast.success('Account created successfully!');
          reset();
          onClose();
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : 'Failed to create account.';
          toast.error(message);
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Open New Account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Account Type"
          options={accountTypeOptions}
          error={errors.accountType?.message}
          {...register('accountType')}
        />

        <Select
          label="Currency"
          options={currencyOptions}
          error={errors.currency?.message}
          {...register('currency')}
        />

        <Input
          label="Initial Deposit (Optional)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.initialDeposit?.message}
          {...register('initialDeposit')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={createAccount.isPending}>
            Create Account
          </Button>
        </div>
      </form>
    </Modal>
  );
};
