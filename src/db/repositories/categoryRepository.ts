import { getDatabase } from '../database';
import { Category, TransactionType } from '../../types';

export const categoryRepository = {
  async getAll(): Promise<Category[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<Category>(
      'SELECT * FROM categories ORDER BY isDefault DESC, name ASC'
    );
    return rows.map(row => ({
      ...row,
      isDefault: Boolean(row.isDefault),
    }));
  },

  async getByType(type: TransactionType): Promise<Category[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<Category>(
      'SELECT * FROM categories WHERE type = ? ORDER BY isDefault DESC, name ASC',
      [type]
    );
    return rows.map(row => ({
      ...row,
      isDefault: Boolean(row.isDefault),
    }));
  },

  async getById(id: string): Promise<Category | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<Category>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    if (!row) return null;
    return {
      ...row,
      isDefault: Boolean(row.isDefault),
    };
  },

  async create(category: Omit<Category, 'createdAt'>): Promise<Category> {
    const db = getDatabase();
    const timestamp = Date.now();
    await db.runAsync(
      'INSERT INTO categories (id, name, icon, color, isDefault, type, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category.id, category.name, category.icon, category.color, category.isDefault ? 1 : 0, category.type, timestamp]
    );
    return { ...category, createdAt: timestamp };
  },

  async update(id: string, updates: Partial<Category>): Promise<void> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.icon !== undefined) {
      fields.push('icon = ?');
      values.push(updates.icon);
    }
    if (updates.color !== undefined) {
      fields.push('color = ?');
      values.push(updates.color);
    }

    if (fields.length === 0) return;

    values.push(id);
    await db.runAsync(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM categories WHERE id = ? AND isDefault = 0', [id]);
  },
};
