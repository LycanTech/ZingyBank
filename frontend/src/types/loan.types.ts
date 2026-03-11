export type LoanType = 'PERSONAL' | 'MORTGAGE' | 'AUTO' | 'STUDENT' | 'BUSINESS' | 'HOME_EQUITY' | 'CREDIT_LINE';
export type LoanStatus = 'APPLICATION' | 'UNDER_REVIEW' | 'APPROVED' | 'DISBURSED' | 'ACTIVE' | 'DELINQUENT' | 'DEFAULT' | 'PAID_OFF' | 'REJECTED' | 'CANCELLED';

export interface LoanResponse {
  id: string;
  loanNumber: string;
  userId: string;
  disbursementAccountNumber: string;
  loanType: LoanType;
  status: LoanStatus;
  principalAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  outstandingBalance: number;
  currency: string;
  createdAt: string;
}

export interface LoanApplicationRequest {
  userId: string;
  disbursementAccountNumber: string;
  loanType: LoanType;
  principalAmount: number;
  termMonths: number;
}
