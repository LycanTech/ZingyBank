import React from 'react';
import { toast } from 'sonner';
import { useToggleCardFeature, useUpdateCardStatus } from '@/hooks/useCards';
import { Button } from '@/components/ui/Button';
import type { CardResponse } from '@/types/card.types';

interface CardControlsProps {
  card: CardResponse;
}

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange, disabled }) => (
  <div className="flex items-center justify-between py-2.5">
    <span className="text-sm text-bank-text">{label}</span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zingy-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? 'bg-zingy-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export const CardControls: React.FC<CardControlsProps> = ({ card }) => {
  const toggleFeature = useToggleCardFeature();
  const updateStatus = useUpdateCardStatus();

  const handleToggle = (feature: string, currentValue: boolean) => {
    toggleFeature.mutate(
      { id: card.id, feature, enabled: !currentValue },
      {
        onSuccess: () => {
          toast.success(`${feature.replace(/([A-Z])/g, ' $1').trim()} ${!currentValue ? 'enabled' : 'disabled'}`);
        },
        onError: () => {
          toast.error('Failed to update card setting');
        },
      }
    );
  };

  const handleBlock = () => {
    updateStatus.mutate(
      { id: card.id, status: card.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED' },
      {
        onSuccess: () => {
          toast.success(card.status === 'BLOCKED' ? 'Card unblocked' : 'Card blocked');
        },
        onError: () => {
          toast.error('Failed to update card status');
        },
      }
    );
  };

  const isBlocked = card.status === 'BLOCKED';

  return (
    <div className="bg-white rounded-xl border border-bank-border shadow-sm p-5">
      <h4 className="text-sm font-semibold text-bank-text mb-3">Card Settings</h4>

      <div className="divide-y divide-bank-border">
        <ToggleSwitch
          label="Contactless Payments"
          checked={card.contactlessEnabled}
          onChange={() => handleToggle('contactless', card.contactlessEnabled)}
          disabled={isBlocked}
        />
        <ToggleSwitch
          label="International Transactions"
          checked={card.internationalEnabled}
          onChange={() => handleToggle('international', card.internationalEnabled)}
          disabled={isBlocked}
        />
        <ToggleSwitch
          label="Online Purchases"
          checked={card.onlineEnabled}
          onChange={() => handleToggle('online', card.onlineEnabled)}
          disabled={isBlocked}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-bank-border">
        <Button
          variant={isBlocked ? 'primary' : 'danger'}
          size="sm"
          className="w-full"
          onClick={handleBlock}
          loading={updateStatus.isPending}
        >
          {isBlocked ? 'Unblock Card' : 'Block Card'}
        </Button>
      </div>
    </div>
  );
};
