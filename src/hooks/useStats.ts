import { useMemo } from 'react';
import { TransactionWithDetails, MonthlyStats, CategoryStats } from '../types';
import { getStartOfMonth, getEndOfMonth, getMonthName } from '../utils/date';

export function useMonthlyStats(
  transactions: TransactionWithDetails[],
  month: number,
  year: number
): MonthlyStats {
  return useMemo(() => {
    const startOfMonth = getStartOfMonth(new Date(year, month, 1).getTime());
    const endOfMonth = getEndOfMonth(new Date(year, month, 1).getTime());

    const monthTransactions = transactions.filter(
      t => t.date >= startOfMonth && t.date <= endOfMonth
    );

    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.convertedAmount, 0);

    const totalExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.convertedAmount, 0);

    return {
      month: getMonthName(month),
      year,
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactionCount: monthTransactions.length,
    };
  }, [transactions, month, year]);
}

export function useCategoryStats(
  transactions: TransactionWithDetails[],
  type: 'income' | 'expense',
  month?: number,
  year?: number
): CategoryStats[] {
  return useMemo(() => {
    let filtered = transactions.filter(t => t.type === type);

    if (month !== undefined && year !== undefined) {
      const startOfMonth = getStartOfMonth(new Date(year, month, 1).getTime());
      const endOfMonth = getEndOfMonth(new Date(year, month, 1).getTime());
      filtered = filtered.filter(t => t.date >= startOfMonth && t.date <= endOfMonth);
    }

    const categoryMap = new Map<string, CategoryStats>();

    filtered.forEach(t => {
      const existing = categoryMap.get(t.categoryId);
      if (existing) {
        existing.total += t.convertedAmount;
        existing.transactionCount += 1;
      } else {
        categoryMap.set(t.categoryId, {
          categoryId: t.categoryId,
          categoryName: t.category.name,
          categoryColor: t.category.color,
          total: t.convertedAmount,
          percentage: 0,
          transactionCount: 1,
        });
      }
    });

    const stats = Array.from(categoryMap.values());
    const totalAmount = stats.reduce((sum, s) => sum + s.total, 0);

    stats.forEach(s => {
      s.percentage = totalAmount > 0 ? (s.total / totalAmount) * 100 : 0;
    });

    return stats.sort((a, b) => b.total - a.total);
  }, [transactions, type, month, year]);
}

export function useBalance(transactions: TransactionWithDetails[]): number {
  return useMemo(() => {
    return transactions.reduce((balance, t) => {
      return t.type === 'income'
        ? balance + t.convertedAmount
        : balance - t.convertedAmount;
    }, 0);
  }, [transactions]);
}
