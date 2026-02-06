import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStore } from '../store';
import { theme } from '../theme';
import { EmptyState, TransactionItem, SearchBar } from '../components';
import { RootStackParamList } from '../navigation/types';
import { TransactionType } from '../types';
import { formatCurrency } from '../utils/currency';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TransactionsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { primaryCurrency, transactions } = useStore();
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(query) ||
        t.category.name.toLowerCase().includes(query) ||
        t.amount.toString().includes(query)
      );
    }

    return filtered;
  }, [transactions, filter, searchQuery]);

  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.convertedAmount : sum - t.convertedAmount;
    }, 0);
  }, [filteredTransactions]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            {filter === 'all' ? 'Net Balance' : filter === 'income' ? 'Total Income' : 'Total Expenses'}
          </Text>
          <Text style={[styles.summaryAmount, {
            color: totalAmount >= 0 ? theme.colors.income : theme.colors.expense
          }]}>
            {totalAmount >= 0 ? '+' : ''}{formatCurrency(Math.abs(totalAmount), primaryCurrency)}
          </Text>
          <Text style={styles.summaryCount}>
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search transactions..."
        />

        <View style={styles.filters}>
          <FilterButton
            label="All"
            active={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          <FilterButton
            label="Income"
            active={filter === 'income'}
            onPress={() => setFilter('income')}
          />
          <FilterButton
            label="Expenses"
            active={filter === 'expense'}
            onPress={() => setFilter('expense')}
          />
        </View>
      </View>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon="search"
          title="No transactions found"
          description={searchQuery ? 'Try a different search term' : filter === 'all' ? 'Add your first transaction' : `No ${filter} transactions found`}
        />
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              primaryCurrency={primaryCurrency}
              onPress={() => navigation.navigate('EditTransaction', { transactionId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction', {})}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={theme.colors.primaryGradient as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Text style={styles.fabIcon}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

interface FilterButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function FilterButton({ label, active, onPress }: FilterButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.filterButton, active && styles.filterButtonActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterButtonText, active && styles.filterButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryAmount: {
    ...theme.typography.h2,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  summaryCount: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
  },
  filters: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  filterButton: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    ...theme.typography.caption,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  list: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '400',
  },
});
