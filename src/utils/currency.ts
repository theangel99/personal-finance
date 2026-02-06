import { Currency } from '../types';

export const EXCHANGE_RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 0.92,
  GBP: 1.17,
  JPY: 0.0064,
  CHF: 1.05,
  CAD: 0.68,
  AUD: 0.62,
  CNY: 0.13,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  JPY: '¥',
  CHF: 'Fr',
  CAD: 'C$',
  AUD: 'A$',
  CNY: '¥',
};

export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  const amountInEUR = amount * EXCHANGE_RATES[fromCurrency];
  const convertedAmount = amountInEUR / EXCHANGE_RATES[toCurrency];
  return Math.round(convertedAmount * 100) / 100;
}

export function formatCurrency(
  amount: number,
  currency: Currency,
  showSymbol: boolean = true
): string {
  const formatted = amount.toFixed(2);
  if (showSymbol) {
    return `${CURRENCY_SYMBOLS[currency]}${formatted}`;
  }
  return formatted;
}

export function formatAmount(amount: number): string {
  return amount.toFixed(2);
}
