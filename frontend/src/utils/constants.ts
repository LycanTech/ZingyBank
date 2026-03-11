export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  CHECKING: 'Checking',
  SAVINGS: 'Savings',
  MONEY_MARKET: 'Money Market',
  CERTIFICATE_OF_DEPOSIT: 'Certificate of Deposit',
  BUSINESS_CHECKING: 'Business Checking',
  BUSINESS_SAVINGS: 'Business Savings',
};

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  DEPOSIT: 'Deposit',
  WITHDRAWAL: 'Withdrawal',
  TRANSFER: 'Transfer',
  PAYMENT: 'Payment',
  FEE: 'Fee',
  INTEREST: 'Interest',
  REFUND: 'Refund',
};

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  BILL_PAYMENT: 'Bill Payment',
  UTILITY_PAYMENT: 'Utility Payment',
  MORTGAGE_PAYMENT: 'Mortgage Payment',
  INSURANCE_PAYMENT: 'Insurance Payment',
  TAX_PAYMENT: 'Tax Payment',
  SUBSCRIPTION: 'Subscription',
  OTHER: 'Other',
};

export const CARD_TYPE_LABELS: Record<string, string> = {
  DEBIT: 'Debit',
  CREDIT: 'Credit',
  PREPAID: 'Prepaid',
  VIRTUAL: 'Virtual',
};

export const LOAN_TYPE_LABELS: Record<string, string> = {
  PERSONAL: 'Personal',
  MORTGAGE: 'Mortgage',
  AUTO: 'Auto',
  STUDENT: 'Student',
  BUSINESS: 'Business',
  HOME_EQUITY: 'Home Equity',
  CREDIT_LINE: 'Credit Line',
};

export const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'text-success bg-green-50',
  COMPLETED: 'text-success bg-green-50',
  APPROVED: 'text-success bg-green-50',
  PAID_OFF: 'text-success bg-green-50',
  DISBURSED: 'text-blue-600 bg-blue-50',
  PENDING: 'text-warning bg-yellow-50',
  PENDING_APPROVAL: 'text-warning bg-yellow-50',
  PENDING_ACTIVATION: 'text-warning bg-yellow-50',
  SCHEDULED: 'text-blue-600 bg-blue-50',
  APPLICATION: 'text-blue-600 bg-blue-50',
  UNDER_REVIEW: 'text-blue-600 bg-blue-50',
  PROCESSING: 'text-blue-600 bg-blue-50',
  FAILED: 'text-danger bg-red-50',
  REJECTED: 'text-danger bg-red-50',
  REVERSED: 'text-danger bg-red-50',
  BLOCKED: 'text-danger bg-red-50',
  LOST: 'text-danger bg-red-50',
  STOLEN: 'text-danger bg-red-50',
  DELINQUENT: 'text-warning bg-orange-50',
  DEFAULT: 'text-danger bg-red-50',
  CANCELLED: 'text-bank-muted bg-gray-100',
  CLOSED: 'text-bank-muted bg-gray-100',
  DORMANT: 'text-bank-muted bg-gray-100',
  EXPIRED: 'text-bank-muted bg-gray-100',
  FROZEN: 'text-blue-600 bg-blue-50',
};
