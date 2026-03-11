import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import { useUserAccounts } from '@/hooks/useAccounts';
import { useIssueCard } from '@/hooks/useCards';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ACCOUNT_TYPE_LABELS } from '@/utils/constants';

const requestCardSchema = z.object({
  cardType: z.string().min(1, 'Card type is required'),
  accountId: z.string().min(1, 'Linked account is required'),
  dailyLimit: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .pipe(z.number().positive('Limit must be positive').optional()),
});

type RequestCardFormData = z.input<typeof requestCardSchema>;

interface RequestCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cardTypeOptions = [
  { value: 'DEBIT', label: 'Debit Card' },
  { value: 'CREDIT', label: 'Credit Card' },
  { value: 'PREPAID', label: 'Prepaid Card' },
  { value: 'VIRTUAL', label: 'Virtual Card' },
];

export const RequestCardModal: React.FC<RequestCardModalProps> = ({ isOpen, onClose }) => {
  const userId = useAuthStore((state) => state.userId);
  const { data: accounts } = useUserAccounts();
  const issueCard = useIssueCard();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestCardFormData>({
    resolver: zodResolver(requestCardSchema),
    defaultValues: {
      cardType: 'DEBIT',
      accountId: '',
      dailyLimit: '',
    },
  });

  const accountOptions = (accounts ?? []).map((acc) => ({
    value: acc.id,
    label: `${ACCOUNT_TYPE_LABELS[acc.accountType] || acc.accountType} (****${acc.accountNumber.slice(-4)})`,
  }));

  const onSubmit = (data: RequestCardFormData) => {
    if (!userId) return;

    const parsed = requestCardSchema.parse(data);
    issueCard.mutate(
      {
        userId,
        accountId: parsed.accountId,
        cardType: parsed.cardType as any,
        dailyLimit: parsed.dailyLimit,
      },
      {
        onSuccess: () => {
          toast.success('Card requested successfully!');
          reset();
          onClose();
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : 'Failed to request card.';
          toast.error(message);
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request New Card">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Card Type"
          options={cardTypeOptions}
          error={errors.cardType?.message}
          {...register('cardType')}
        />

        <Select
          label="Linked Account"
          options={[{ value: '', label: 'Select an account' }, ...accountOptions]}
          error={errors.accountId?.message}
          {...register('accountId')}
        />

        <Input
          label="Daily Limit (Optional)"
          type="number"
          step="0.01"
          min="0"
          placeholder="e.g., 5000"
          error={errors.dailyLimit?.message}
          {...register('dailyLimit')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={issueCard.isPending}>
            Request Card
          </Button>
        </div>
      </form>
    </Modal>
  );
};
