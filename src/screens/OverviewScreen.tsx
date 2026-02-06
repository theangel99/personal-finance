import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStore } from '../store';
import { theme } from '../theme';
import { Card, EmptyState, TransactionItem } from '../components';
import { formatCurrency } from '../utils/currency';
import { useMonthlyStats, useBalance } from '../hooks/useStats';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OverviewScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    primaryCurrency,
    transactions,
  } = useStore();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyStats = useMonthlyStats(transactions, currentMonth, currentYear);
  const totalBalance = useBalance(transactions);

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Premium Gradient Balance Card */}
      <LinearGradient
        colors={theme.colors.primaryGradient as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <View style={styles.balanceCardContent}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(totalBalance, primaryCurrency)}
          </Text>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceFooter}>
            <View style={styles.balanceFooterItem}>
              <Text style={styles.balanceFooterLabel}>This Month</Text>
              <Text style={styles.balanceFooterValue}>
                {monthlyStats.totalIncome > monthlyStats.totalExpenses ? '+' : ''}
                {formatCurrency(monthlyStats.totalIncome - monthlyStats.totalExpenses, primaryCurrency)}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: theme.colors.incomeBackground }]}>
            <View style={[styles.statIconDot, { backgroundColor: theme.colors.income }]} />
          </View>
          <Text style={styles.statLabel}>Income</Text>
          <Text style={[styles.statAmount, { color: theme.colors.income }]}>
            {formatCurrency(monthlyStats.totalIncome, primaryCurrency)}
          </Text>
          <Text style={styles.statPeriod}>This month</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: theme.colors.expenseBackground }]}>
            <View style={[styles.statIconDot, { backgroundColor: theme.colors.expense }]} />
          </View>
          <Text style={styles.statLabel}>Expenses</Text>
          <Text style={[styles.statAmount, { color: theme.colors.expense }]}>
            {formatCurrency(monthlyStats.totalExpenses, primaryCurrency)}
          </Text>
          <Text style={styles.statPeriod}>This month</Text>
        </View>
      </View>

      {/* Recent Transactions Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: 'Transactions' })}
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length === 0 ? (
          <Card style={styles.emptyStateCard}>
            <EmptyState
              icon="transactions"
              title="No transactions yet"
              description="Add your first transaction to start tracking your finances"
            />
          </Card>
        ) : (
          <Card style={styles.transactionsCard}>
            {recentTransactions.map((transaction, index) => (
              <View key={transaction.id}>
                <TransactionItem
                  transaction={transaction}
                  primaryCurrency={primaryCurrency}
                  onPress={() => navigation.navigate('EditTransaction', { transactionId: transaction.id })}
                />
                {index < recentTransactions.length - 1 && <View style={styles.transactionDivider} />}
              </View>
            ))}
          </Card>
        )}
      </View>

      {/* Premium FAB */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  // Premium Balance Card
  balanceCard: {
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  balanceCardContent: {
    padding: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
  },
  balanceLabel: {
    ...theme.typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  balanceAmount: {
    ...theme.typography.h1,
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '700',
    marginBottom: theme.spacing.lg,
  },
  balanceDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: theme.spacing.md,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceFooterItem: {
    flex: 1,
  },
  balanceFooterLabel: {
    ...theme.typography.small,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: theme.spacing.xs,
    fontSize: 11,
  },
  balanceFooterValue: {
    ...theme.typography.bodyBold,
    color: '#FFFFFF',
    fontSize: 16,
  },
  // Modern Stats Cards
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  statIconDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontSize: 13,
  },
  statAmount: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
    fontSize: 22,
    fontWeight: '700',
  },
  statPeriod: {
    ...theme.typography.small,
    color: theme.colors.textTertiary,
    fontSize: 11,
  },
  // Section Header
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xs,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  seeAllButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  seeAll: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  // Transactions Card
  transactionsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  transactionDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing.md,
  },
  emptyStateCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
  },
  // Premium FAB
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
