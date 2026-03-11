export type AccountType = 'CHECKING' | 'SAVINGS' | 'MONEY_MARKET' | 'CERTIFICATE_OF_DEPOSIT' | 'BUSINESS_CHECKING' | 'BUSINESS_SAVINGS';
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'DORMANT' | 'CLOSED' | 'PENDING_APPROVAL';

export interface AccountResponse {
  id: string;
  accountNumber: string;
  userId: string;
  accountType: AccountType;
  status: AccountStatus;
  balance: number;
  currency: string;
  interestRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountRequest {
  userId: string;
  accountType: AccountType;
  currency?: string;
  initialDeposit?: number;
}
