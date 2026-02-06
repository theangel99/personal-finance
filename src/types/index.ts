export type Currency = 'EUR' | 'USD' | 'GBP' | 'JPY' | 'CHF' | 'CAD' | 'AUD' | 'CNY';

export type TransactionType = 'expense' | 'income';

export type PaymentMethodType = 'cash' | 'debit_card' | 'credit_card' | 'custom';

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  isDefault: boolean;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  type: TransactionType;
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  convertedAmount: number;
  categoryId: string;
  paymentMethodId: string;
  description: string;
  date: number;
  isRecurring: boolean;
  recurringTransactionId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface RecurringTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  categoryId: string;
  paymentMethodId: string;
  description: string;
  frequency: 'monthly';
  dayOfMonth: number;
  isActive: boolean;
  startDate: number;
  endDate?: number;
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  primaryCurrency: Currency;
  currencySymbol: string;
}

export interface TransactionWithDetails extends Transaction {
  category: Category;
  paymentMethod: PaymentMethod;
}

export interface DateRange {
  startDate: number;
  endDate: number;
}

export interface MonthlyStats {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  total: number;
  percentage: number;
  transactionCount: number;
}
