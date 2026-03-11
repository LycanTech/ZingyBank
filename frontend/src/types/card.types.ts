export type CardType = 'DEBIT' | 'CREDIT' | 'PREPAID' | 'VIRTUAL';
export type CardStatus = 'PENDING_ACTIVATION' | 'ACTIVE' | 'BLOCKED' | 'EXPIRED' | 'CANCELLED' | 'LOST' | 'STOLEN';

export interface CardResponse {
  id: string;
  cardNumberMasked: string;
  userId: string;
  accountId: string;
  cardType: CardType;
  status: CardStatus;
  expiryDate: string;
  dailyLimit: number;
  monthlyLimit: number;
  contactlessEnabled: boolean;
  internationalEnabled: boolean;
  onlineEnabled: boolean;
  createdAt: string;
}

export interface IssueCardRequest {
  userId: string;
  accountId: string;
  cardType: CardType;
  dailyLimit?: number;
}
