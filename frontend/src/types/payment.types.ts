export type PaymentType = 'BILL_PAYMENT' | 'UTILITY_PAYMENT' | 'MORTGAGE_PAYMENT' | 'INSURANCE_PAYMENT' | 'TAX_PAYMENT' | 'SUBSCRIPTION' | 'OTHER';
export type PaymentStatus = 'SCHEDULED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface PaymentResponse {
  id: string;
  paymentReference: string;
  accountNumber: string;
  payeeId: string;
  payeeName: string;
  amount: number;
  currency: string;
  paymentType: PaymentType;
  status: PaymentStatus;
  scheduledDate: string;
  description: string;
  createdAt: string;
}

export interface CreatePaymentRequest {
  accountNumber: string;
  payeeName: string;
  payeeAccountNumber: string;
  amount: number;
  currency: string;
  paymentType: PaymentType;
  scheduledDate?: string;
  description: string;
}
