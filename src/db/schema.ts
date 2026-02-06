export const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    isDefault INTEGER NOT NULL,
    type TEXT NOT NULL,
    createdAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS payment_methods (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    isDefault INTEGER NOT NULL,
    createdAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    convertedAmount REAL NOT NULL,
    categoryId TEXT NOT NULL,
    paymentMethodId TEXT NOT NULL,
    description TEXT NOT NULL,
    date INTEGER NOT NULL,
    isRecurring INTEGER NOT NULL,
    recurringTransactionId TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    FOREIGN KEY (categoryId) REFERENCES categories(id),
    FOREIGN KEY (paymentMethodId) REFERENCES payment_methods(id)
  );

  CREATE TABLE IF NOT EXISTS recurring_transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    categoryId TEXT NOT NULL,
    paymentMethodId TEXT NOT NULL,
    description TEXT NOT NULL,
    frequency TEXT NOT NULL,
    dayOfMonth INTEGER NOT NULL,
    isActive INTEGER NOT NULL,
    startDate INTEGER NOT NULL,
    endDate INTEGER,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    FOREIGN KEY (categoryId) REFERENCES categories(id),
    FOREIGN KEY (paymentMethodId) REFERENCES payment_methods(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
  CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(categoryId);
  CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
`;
