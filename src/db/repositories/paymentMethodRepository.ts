import { getDatabase } from '../database';
import { PaymentMethod } from '../../types';

export const paymentMethodRepository = {
  async getAll(): Promise<PaymentMethod[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<PaymentMethod>(
      'SELECT * FROM payment_methods ORDER BY isDefault DESC, name ASC'
    );
    return rows.map(row => ({
      ...row,
      isDefault: Boolean(row.isDefault),
    }));
  },

  async getById(id: string): Promise<PaymentMethod | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<PaymentMethod>(
      'SELECT * FROM payment_methods WHERE id = ?',
      [id]
    );
    if (!row) return null;
    return {
      ...row,
      isDefault: Boolean(row.isDefault),
    };
  },

  async create(method: Omit<PaymentMethod, 'createdAt'>): Promise<PaymentMethod> {
    const db = getDatabase();
    const timestamp = Date.now();
    await db.runAsync(
      'INSERT INTO payment_methods (id, name, type, isDefault, createdAt) VALUES (?, ?, ?, ?, ?)',
      [method.id, method.name, method.type, method.isDefault ? 1 : 0, timestamp]
    );
    return { ...method, createdAt: timestamp };
  },

  async update(id: string, updates: Partial<PaymentMethod>): Promise<void> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }

    if (fields.length === 0) return;

    values.push(id);
    await db.runAsync(
      `UPDATE payment_methods SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM payment_methods WHERE id = ? AND isDefault = 0', [id]);
  },
};
