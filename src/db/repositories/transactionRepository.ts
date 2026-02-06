import { getDatabase } from '../database';
import { Transaction, TransactionWithDetails, DateRange, TransactionType } from '../../types';

export const transactionRepository = {
  async getAll(limit?: number): Promise<Transaction[]> {
    const db = getDatabase();
    const query = limit
      ? 'SELECT * FROM transactions ORDER BY date DESC, createdAt DESC LIMIT ?'
      : 'SELECT * FROM transactions ORDER BY date DESC, createdAt DESC';
    const params = limit ? [limit] : [];
    const rows = await db.getAllAsync<Transaction>(query, params);
    return rows.map(row => ({
      ...row,
      isRecurring: Boolean(row.isRecurring),
    }));
  },

  async getById(id: string): Promise<Transaction | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<Transaction>(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );
    if (!row) return null;
    return {
      ...row,
      isRecurring: Boolean(row.isRecurring),
    };
  },

  async getByDateRange(range: DateRange): Promise<Transaction[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<Transaction>(
      'SELECT * FROM transactions WHERE date >= ? AND date <= ? ORDER BY date DESC',
      [range.startDate, range.endDate]
    );
    return rows.map(row => ({
      ...row,
      isRecurring: Boolean(row.isRecurring),
    }));
  },

  async getWithDetails(limit?: number): Promise<TransactionWithDetails[]> {
    const db = getDatabase();
    const query = limit
      ? `SELECT
          t.*,
          c.name as categoryName, c.icon as categoryIcon, c.color as categoryColor,
          c.isDefault as categoryIsDefault, c.type as categoryType, c.createdAt as categoryCreatedAt,
          pm.name as paymentMethodName, pm.type as paymentMethodType,
          pm.isDefault as paymentMethodIsDefault, pm.createdAt as paymentMethodCreatedAt
        FROM transactions t
        LEFT JOIN categories c ON t.categoryId = c.id
        LEFT JOIN payment_methods pm ON t.paymentMethodId = pm.id
        ORDER BY t.date DESC, t.createdAt DESC
        LIMIT ?`
      : `SELECT
          t.*,
          c.name as categoryName, c.icon as categoryIcon, c.color as categoryColor,
          c.isDefault as categoryIsDefault, c.type as categoryType, c.createdAt as categoryCreatedAt,
          pm.name as paymentMethodName, pm.type as paymentMethodType,
          pm.isDefault as paymentMethodIsDefault, pm.createdAt as paymentMethodCreatedAt
        FROM transactions t
        LEFT JOIN categories c ON t.categoryId = c.id
        LEFT JOIN payment_methods pm ON t.paymentMethodId = pm.id
        ORDER BY t.date DESC, t.createdAt DESC`;

    const params = limit ? [limit] : [];
    const rows = await db.getAllAsync<any>(query, params);

    return rows.map(row => ({
      id: row.id,
      type: row.type,
      amount: row.amount,
      currency: row.currency,
      convertedAmount: row.convertedAmount,
      categoryId: row.categoryId,
      paymentMethodId: row.paymentMethodId,
      description: row.description,
      date: row.date,
      isRecurring: Boolean(row.isRecurring),
      recurringTransactionId: row.recurringTransactionId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: {
        id: row.categoryId,
        name: row.categoryName,
        icon: row.categoryIcon,
        color: row.categoryColor,
        isDefault: Boolean(row.categoryIsDefault),
        type: row.categoryType,
        createdAt: row.categoryCreatedAt,
      },
      paymentMethod: {
        id: row.paymentMethodId,
        name: row.paymentMethodName,
        type: row.paymentMethodType,
        isDefault: Boolean(row.paymentMethodIsDefault),
        createdAt: row.paymentMethodCreatedAt,
      },
    }));
  },

  async getByType(type: TransactionType, limit?: number): Promise<Transaction[]> {
    const db = getDatabase();
    const query = limit
      ? 'SELECT * FROM transactions WHERE type = ? ORDER BY date DESC, createdAt DESC LIMIT ?'
      : 'SELECT * FROM transactions WHERE type = ? ORDER BY date DESC, createdAt DESC';
    const params = limit ? [type, limit] : [type];
    const rows = await db.getAllAsync<Transaction>(query, params);
    return rows.map(row => ({
      ...row,
      isRecurring: Boolean(row.isRecurring),
    }));
  },

  async create(transaction: Omit<Transaction, 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const db = getDatabase();
    const timestamp = Date.now();
    await db.runAsync(
      `INSERT INTO transactions
        (id, type, amount, currency, convertedAmount, categoryId, paymentMethodId,
         description, date, isRecurring, recurringTransactionId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        transaction.id,
        transaction.type,
        transaction.amount,
        transaction.currency,
        transaction.convertedAmount,
        transaction.categoryId,
        transaction.paymentMethodId,
        transaction.description,
        transaction.date,
        transaction.isRecurring ? 1 : 0,
        transaction.recurringTransactionId || null,
        timestamp,
        timestamp,
      ]
    );
    return { ...transaction, createdAt: timestamp, updatedAt: timestamp };
  },

  async update(id: string, updates: Partial<Transaction>): Promise<void> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (updates.type !== undefined) {
      fields.push('type = ?');
      values.push(updates.type);
    }
    if (updates.amount !== undefined) {
      fields.push('amount = ?');
      values.push(updates.amount);
    }
    if (updates.currency !== undefined) {
      fields.push('currency = ?');
      values.push(updates.currency);
    }
    if (updates.convertedAmount !== undefined) {
      fields.push('convertedAmount = ?');
      values.push(updates.convertedAmount);
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
    if (updates.date !== undefined) {
      fields.push('date = ?');
      values.push(updates.date);
    }

    if (fields.length === 0) return;

    fields.push('updatedAt = ?');
    values.push(Date.now());
    values.push(id);

    await db.runAsync(
      `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
  },

  async getTotalByType(type: TransactionType, dateRange?: DateRange): Promise<number> {
    const db = getDatabase();
    let query = 'SELECT COALESCE(SUM(convertedAmount), 0) as total FROM transactions WHERE type = ?';
    const params: (string | number)[] = [type];

    if (dateRange) {
      query += ' AND date >= ? AND date <= ?';
      params.push(dateRange.startDate, dateRange.endDate);
    }

    const result = await db.getFirstAsync<{ total: number }>(query, params);
    return result?.total || 0;
  },
};
