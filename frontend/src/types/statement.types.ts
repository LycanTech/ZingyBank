export interface StatementResponse {
  id: string;
  accountNumber: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  openingBalance: number;
  closingBalance: number;
  totalCredits: number;
  totalDebits: number;
  transactionCount: number;
}
