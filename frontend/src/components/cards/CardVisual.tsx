import React from 'react';
import { Wifi } from 'lucide-react';
import type { CardResponse } from '@/types/card.types';
import { CARD_TYPE_LABELS } from '@/utils/constants';

interface CardVisualProps {
  card: CardResponse;
}

export const CardVisual: React.FC<CardVisualProps> = ({ card }) => {
  const maskedGroups = card.cardNumberMasked
    ? card.cardNumberMasked.match(/.{1,4}/g)?.join('  ') ?? card.cardNumberMasked
    : '****  ****  ****  ****';

  return (
    <div className="relative w-full aspect-[1.586/1] max-w-sm rounded-2xl bg-gradient-to-br from-zingy-600 via-zingy-700 to-zingy-800 p-6 text-white shadow-lg overflow-hidden select-none">
      {/* Decorative pattern */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-12 translate-x-12" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-8 -translate-x-8" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-8">
        <span className="text-sm font-bold tracking-wider">ZingyBank</span>
        <Wifi className="w-5 h-5 rotate-90 opacity-70" />
      </div>

      {/* Chip */}
      <div className="relative mb-6">
        <div className="w-11 h-8 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600/30">
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-px p-1 opacity-60">
            <div className="rounded-sm bg-yellow-600/30" />
            <div className="rounded-sm bg-yellow-600/30" />
            <div className="rounded-sm bg-yellow-600/30" />
            <div className="rounded-sm bg-yellow-600/30" />
          </div>
        </div>
      </div>

      {/* Card number */}
      <div className="relative mb-4">
        <p className="text-lg font-mono tracking-[0.15em] font-medium">{maskedGroups}</p>
      </div>

      {/* Footer */}
      <div className="relative flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">Expires</p>
          <p className="text-sm font-medium">{card.expiryDate || 'MM/YY'}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">
            {CARD_TYPE_LABELS[card.cardType] || card.cardType}
          </span>
        </div>
      </div>
    </div>
  );
};
