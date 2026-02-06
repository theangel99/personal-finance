import { getDatabase } from '../database';
import { Currency } from '../../types';

export const settingsRepository = {
  async getPrimaryCurrency(): Promise<Currency> {
    const db = getDatabase();
    const row = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM settings WHERE key = ?',
      ['primaryCurrency']
    );
    return (row?.value as Currency) || 'EUR';
  },

  async setPrimaryCurrency(currency: Currency): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      ['primaryCurrency', currency]
    );
  },
};
