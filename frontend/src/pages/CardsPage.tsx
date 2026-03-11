import React, { useState } from 'react';
import { CreditCard, Plus } from 'lucide-react';
import { useUserCards } from '@/hooks/useCards';
import { CardVisual } from '@/components/cards/CardVisual';
import { CardControls } from '@/components/cards/CardControls';
import { RequestCardModal } from '@/components/cards/RequestCardModal';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';

const CardsPage: React.FC = () => {
  const { data: cards, isLoading } = useUserCards();
  const [showRequest, setShowRequest] = useState(false);

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
          <h1 className="text-2xl font-bold text-bank-text">My Cards</h1>
          <p className="text-sm text-bank-muted mt-0.5">Manage your debit and credit cards</p>
        </div>
        <Button onClick={() => setShowRequest(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Request New Card
        </Button>
      </div>

      {!cards || cards.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="w-12 h-12 text-zingy-400" />}
          title="No cards yet"
          description="Request your first card to start making purchases."
          action={
            <Button onClick={() => setShowRequest(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Request New Card
            </Button>
          }
        />
      ) : (
        <div className="space-y-8">
          {cards.map((card) => (
            <div key={card.id} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div>
                <CardVisual card={card} />
                <div className="mt-3 flex items-center gap-2">
                  <Badge status={card.status.toLowerCase()}>
                    {card.status.replace(/_/g, ' ')}
                  </Badge>
                  <span className="text-xs text-bank-muted">
                    Daily limit: ${card.dailyLimit?.toLocaleString() ?? 'N/A'}
                  </span>
                </div>
              </div>
              <CardControls card={card} />
            </div>
          ))}
        </div>
      )}

      <RequestCardModal
        isOpen={showRequest}
        onClose={() => setShowRequest(false)}
      />
    </div>
  );
};

export default CardsPage;
