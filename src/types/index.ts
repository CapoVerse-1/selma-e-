export interface FinancialEntry {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Income extends FinancialEntry {
  client: string;
  invoiceNumber?: string;
}

export interface Expense extends FinancialEntry {
  vendor: string;
  receiptNumber?: string;
  taxDeductible: boolean;
}

export type Month = 
  | 'Januar'
  | 'Februar'
  | 'März'
  | 'April'
  | 'Mai'
  | 'Juni'
  | 'Juli'
  | 'August'
  | 'September'
  | 'Oktober'
  | 'November'
  | 'Dezember';

export interface MonthlyData {
  month: Month;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface FinancialStatistics {
  monthly: MonthlyData[];
  currentMonth: MonthlyData;
  yearToDate: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
}
