import { getDatabase } from '../database';
import { RecurringTransaction } from '../../types';

export const recurringTransactionRepository = {
  async getAll(): Promise<RecurringTransaction[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<RecurringTransaction>(
      'SELECT * FROM recurring_transactions ORDER BY dayOfMonth ASC'
    );
    return rows.map(row => ({
      ...row,
      isActive: Boolean(row.isActive),
    }));
  },

  async getActive(): Promise<RecurringTransaction[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<RecurringTransaction>(
      'SELECT * FROM recurring_transactions WHERE isActive = 1 ORDER BY dayOfMonth ASC'
    );
    return rows.map(row => ({
      ...row,
      isActive: Boolean(row.isActive),
    }));
  },

  async getById(id: string): Promise<RecurringTransaction | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<RecurringTransaction>(
      'SELECT * FROM recurring_transactions WHERE id = ?',
      [id]
    );
    if (!row) return null;
    return {
      ...row,
      isActive: Boolean(row.isActive),
    };
  },

  async create(transaction: Omit<RecurringTransaction, 'createdAt' | 'updatedAt'>): Promise<RecurringTransaction> {
    const db = getDatabase();
    const timestamp = Date.now();
    await db.runAsync(
      `INSERT INTO recurring_transactions
        (id, type, amount, currency, categoryId, paymentMethodId, description,
         frequency, dayOfMonth, isActive, startDate, endDate, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        transaction.id,
        transaction.type,
        transaction.amount,
        transaction.currency,
        transaction.categoryId,
        transaction.paymentMethodId,
        transaction.description,
        transaction.frequency,
        transaction.dayOfMonth,
        transaction.isActive ? 1 : 0,
        transaction.startDate,
        transaction.endDate || null,
        timestamp,
        timestamp,
      ]
    );
    return { ...transaction, createdAt: timestamp, updatedAt: timestamp };
  },

  async update(id: string, updates: Partial<RecurringTransaction>): Promise<void> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (updates.amount !== undefined) {
      fields.push('amount = ?');
      values.push(updates.amount);
    }
    if (updates.currency !== undefined) {
      fields.push('currency = ?');
      values.push(updates.currency);
    }
    if (updates.categoryId !== undefined) {
      fields.push('categoryId = ?');
      values.push(updates.categoryId);
    }
    if (updates.paymentMethodId !== undefined) {
      fields.push('paymentMethodId = ?');
      values.push(updates.paymentMethodId);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.dayOfMonth !== undefined) {
      fields.push('dayOfMonth = ?');
      values.push(updates.dayOfMonth);
    }
    if (updates.isActive !== undefined) {
      fields.push('isActive = ?');
      values.push(updates.isActive ? 1 : 0);
    }
    if (updates.endDate !== undefined) {
      fields.push('endDate = ?');
      values.push(updates.endDate);
    }

    if (fields.length === 0) return;

    fields.push('updatedAt = ?');
    values.push(Date.now());
    values.push(id);

    await db.runAsync(
      `UPDATE recurring_transactions SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM recurring_transactions WHERE id = ?', [id]);
  },
};
