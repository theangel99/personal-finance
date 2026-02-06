import { create } from 'zustand';
import {
  Category,
  PaymentMethod,
  Transaction,
  RecurringTransaction,
  Currency,
  TransactionWithDetails,
} from '../types';
import {
  categoryRepository,
  paymentMethodRepository,
  transactionRepository,
  recurringTransactionRepository,
  settingsRepository,
} from '../db/repositories';

interface AppState {
  isInitialized: boolean;
  primaryCurrency: Currency;
  categories: Category[];
  paymentMethods: PaymentMethod[];
  transactions: TransactionWithDetails[];
  recurringTransactions: RecurringTransaction[];

  initialize: () => Promise<void>;
  loadCategories: () => Promise<void>;
  loadPaymentMethods: () => Promise<void>;
  loadTransactions: (limit?: number) => Promise<void>;
  loadRecurringTransactions: () => Promise<void>;

  setPrimaryCurrency: (currency: Currency) => Promise<void>;

  addCategory: (category: Omit<Category, 'createdAt'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  addPaymentMethod: (method: Omit<PaymentMethod, 'createdAt'>) => Promise<void>;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;

  addTransaction: (transaction: Omit<Transaction, 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  addRecurringTransaction: (transaction: Omit<RecurringTransaction, 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRecurringTransaction: (id: string, updates: Partial<RecurringTransaction>) => Promise<void>;
  deleteRecurringTransaction: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  isInitialized: false,
  primaryCurrency: 'EUR',
  categories: [],
  paymentMethods: [],
  transactions: [],
  recurringTransactions: [],

  initialize: async () => {
    const currency = await settingsRepository.getPrimaryCurrency();
    const categories = await categoryRepository.getAll();
    const paymentMethods = await paymentMethodRepository.getAll();
    const transactions = await transactionRepository.getWithDetails(100);
    const recurringTransactions = await recurringTransactionRepository.getAll();

    set({
      isInitialized: true,
      primaryCurrency: currency,
      categories,
      paymentMethods,
      transactions,
      recurringTransactions,
    });
  },

  loadCategories: async () => {
    const categories = await categoryRepository.getAll();
    set({ categories });
  },

  loadPaymentMethods: async () => {
    const paymentMethods = await paymentMethodRepository.getAll();
    set({ paymentMethods });
  },

  loadTransactions: async (limit?: number) => {
    const transactions = await transactionRepository.getWithDetails(limit);
    set({ transactions });
  },

  loadRecurringTransactions: async () => {
    const recurringTransactions = await recurringTransactionRepository.getAll();
    set({ recurringTransactions });
  },

  setPrimaryCurrency: async (currency: Currency) => {
    await settingsRepository.setPrimaryCurrency(currency);
    set({ primaryCurrency: currency });
  },

  addCategory: async (category: Omit<Category, 'createdAt'>) => {
    await categoryRepository.create(category);
    await get().loadCategories();
  },

  updateCategory: async (id: string, updates: Partial<Category>) => {
    await categoryRepository.update(id, updates);
    await get().loadCategories();
  },

  deleteCategory: async (id: string) => {
    await categoryRepository.delete(id);
    await get().loadCategories();
  },

  addPaymentMethod: async (method: Omit<PaymentMethod, 'createdAt'>) => {
    await paymentMethodRepository.create(method);
    await get().loadPaymentMethods();
  },

  updatePaymentMethod: async (id: string, updates: Partial<PaymentMethod>) => {
    await paymentMethodRepository.update(id, updates);
    await get().loadPaymentMethods();
  },

  deletePaymentMethod: async (id: string) => {
    await paymentMethodRepository.delete(id);
    await get().loadPaymentMethods();
  },

  addTransaction: async (transaction: Omit<Transaction, 'createdAt' | 'updatedAt'>) => {
    await transactionRepository.create(transaction);
    await get().loadTransactions(100);
  },

  updateTransaction: async (id: string, updates: Partial<Transaction>) => {
    await transactionRepository.update(id, updates);
    await get().loadTransactions(100);
  },

  deleteTransaction: async (id: string) => {
    await transactionRepository.delete(id);
    await get().loadTransactions(100);
  },

  addRecurringTransaction: async (transaction: Omit<RecurringTransaction, 'createdAt' | 'updatedAt'>) => {
    await recurringTransactionRepository.create(transaction);
    await get().loadRecurringTransactions();
  },

  updateRecurringTransaction: async (id: string, updates: Partial<RecurringTransaction>) => {
    await recurringTransactionRepository.update(id, updates);
    await get().loadRecurringTransactions();
  },

  deleteRecurringTransaction: async (id: string) => {
    await recurringTransactionRepository.delete(id);
    await get().loadRecurringTransactions();
  },
}));
