import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TransactionWithDetails } from '../types';
import { theme } from '../theme';
import { formatDate } from '../utils/date';
import { formatCurrency } from '../utils/currency';
import { CategoryIcon } from './CategoryIcon';

interface TransactionItemProps {
  transaction: TransactionWithDetails;
  primaryCurrency: string;
  onPress?: () => void;
}

export function TransactionItem({ transaction, primaryCurrency, onPress }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? theme.colors.income : theme.colors.expense;
  const amountBg = isIncome ? theme.colors.incomeBackground : theme.colors.expenseBackground;
  const amountPrefix = isIncome ? '+' : '-';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: transaction.category.color + '15' }]}>
        <CategoryIcon
          name={transaction.category.icon}
          size={20}
          color={transaction.category.color}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description || transaction.category.name}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{transaction.category.name}</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{formatDate(transaction.date)}</Text>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <View style={[styles.amountBadge, { backgroundColor: amountBg }]}>
          <Text style={[styles.amount, { color: amountColor }]}>
            {amountPrefix}{formatCurrency(transaction.convertedAmount, primaryCurrency as any)}
          </Text>
        </View>
        {transaction.currency !== primaryCurrency && (
          <Text style={styles.originalAmount}>
            {formatCurrency(transaction.amount, transaction.currency)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  content: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  description: {
    ...theme.typography.bodyBold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.textTertiary,
    marginHorizontal: theme.spacing.xs,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  amount: {
    ...theme.typography.bodyBold,
    fontSize: 16,
  },
  originalAmount: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
});
