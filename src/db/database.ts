import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabaseAsync('finance_tracker.db');
  await db.execAsync(CREATE_TABLES);
  await seedDefaultData(db);

  return db;
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

async function seedDefaultData(database: SQLite.SQLiteDatabase): Promise<void> {
  const categoriesCount = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories'
  );

  if (categoriesCount && categoriesCount.count > 0) {
    return;
  }

  const defaultCategories = [
    { id: 'cat-food', name: 'Food & Dining', icon: 'food', color: '#EC4899', type: 'expense', isDefault: 1 },
    { id: 'cat-transport', name: 'Transportation', icon: 'transport', color: '#3B82F6', type: 'expense', isDefault: 1 },
    { id: 'cat-shopping', name: 'Shopping', icon: 'shopping', color: '#8B5CF6', type: 'expense', isDefault: 1 },
    { id: 'cat-bills', name: 'Bills & Utilities', icon: 'bills', color: '#F59E0B', type: 'expense', isDefault: 1 },
    { id: 'cat-entertainment', name: 'Entertainment', icon: 'entertainment', color: '#EF4444', type: 'expense', isDefault: 1 },
    { id: 'cat-health', name: 'Healthcare', icon: 'health', color: '#10B981', type: 'expense', isDefault: 1 },
    { id: 'cat-housing', name: 'Housing', icon: 'housing', color: '#06B6D4', type: 'expense', isDefault: 1 },
    { id: 'cat-other-expense', name: 'Other', icon: 'other', color: '#6B7280', type: 'expense', isDefault: 1 },
    { id: 'cat-salary', name: 'Salary', icon: 'salary', color: '#10B981', type: 'income', isDefault: 1 },
    { id: 'cat-freelance', name: 'Freelance', icon: 'salary', color: '#06B6D4', type: 'income', isDefault: 1 },
    { id: 'cat-investments', name: 'Investments', icon: 'investment', color: '#8B5CF6', type: 'income', isDefault: 1 },
    { id: 'cat-other-income', name: 'Other', icon: 'other', color: '#10B981', type: 'income', isDefault: 1 },
  ];

  const timestamp = Date.now();
  for (const category of defaultCategories) {
    await database.runAsync(
      'INSERT INTO categories (id, name, icon, color, isDefault, type, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category.id, category.name, category.icon, category.color, category.isDefault, category.type, timestamp]
    );
  }

  const defaultPaymentMethods = [
    { id: 'pm-cash', name: 'Cash', type: 'cash', isDefault: 1 },
    { id: 'pm-debit', name: 'Debit Card', type: 'debit_card', isDefault: 1 },
    { id: 'pm-credit', name: 'Credit Card', type: 'credit_card', isDefault: 1 },
  ];

  for (const method of defaultPaymentMethods) {
    await database.runAsync(
      'INSERT INTO payment_methods (id, name, type, isDefault, createdAt) VALUES (?, ?, ?, ?, ?)',
      [method.id, method.name, method.type, method.isDefault, timestamp]
    );
  }

  await database.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    ['primaryCurrency', 'EUR']
  );
}
