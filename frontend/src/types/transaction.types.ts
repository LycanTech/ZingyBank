export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT' | 'FEE' | 'INTEREST' | 'REFUND';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED' | 'CANCELLED';

export interface TransactionResponse {
  id: string;
  transactionReference: string;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  initiatedBy: string;
  createdAt: string;
}

export interface TransferRequest {
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  currency: string;
  description: string;
  initiatedBy: string;
}
