import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useStore } from '../store';
import { theme } from '../theme';
import { Card } from '../components';
import { useCategoryStats, useMonthlyStats } from '../hooks/useStats';
import { formatCurrency } from '../utils/currency';
import { getMonthName } from '../utils/date';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const { primaryCurrency, transactions } = useStore();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [selectedType, setSelectedType] = useState<'expense' | 'income'>('expense');

  const categoryStats = useCategoryStats(transactions, selectedType, currentMonth, currentYear);

  const last6MonthsStats = useMemo(() => {
    const stats = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();

      const startOfMonth = new Date(year, month, 1).getTime();
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();

      const monthTransactions = transactions.filter(
        t => t.date >= startOfMonth && t.date <= endOfMonth
      );

      const totalIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.convertedAmount, 0);

      const totalExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.convertedAmount, 0);

      stats.push({
        label: getMonthName(month).slice(0, 3),
        income: totalIncome,
        expenses: totalExpenses,
      });
    }
    return stats;
  }, [transactions, currentMonth, currentYear]);

  const pieData = categoryStats.slice(0, 6).map((stat, index) => ({
    name: stat.categoryName,
    amount: stat.total,
    color: theme.colors.chartColors[index % theme.colors.chartColors.length],
    legendFontColor: theme.colors.textSecondary,
    legendFontSize: 12,
  }));

  const barData = {
    labels: last6MonthsStats.map(s => s.label),
    datasets: [
      {
        data: selectedType === 'expense'
          ? last6MonthsStats.map(s => s.expenses)
          : last6MonthsStats.map(s => s.income),
      },
    ],
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(74, 158, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.6})`,
    style: {
      borderRadius: theme.borderRadius.lg,
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.typeSelector}>
        <TypeButton
          label="Expenses"
          active={selectedType === 'expense'}
          onPress={() => setSelectedType('expense')}
        />
        <TypeButton
          label="Income"
          active={selectedType === 'income'}
          onPress={() => setSelectedType('income')}
        />
      </View>

      {categoryStats.length > 0 ? (
        <>
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Category Breakdown</Text>
            <Text style={styles.chartSubtitle}>Current month</Text>
            <PieChart
              data={pieData}
              width={screenWidth - theme.spacing.md * 4}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card>

          <Card style={styles.statsCard}>
            <Text style={styles.chartTitle}>Top Categories</Text>
            {categoryStats.slice(0, 5).map((stat, index) => (
              <View key={stat.categoryId} style={styles.statRow}>
                <View
                  style={[
                    styles.statColor,
                    { backgroundColor: theme.colors.chartColors[index % theme.colors.chartColors.length] },
                  ]}
                />
                <Text style={styles.statName}>{stat.categoryName}</Text>
                <View style={styles.statAmounts}>
                  <Text style={styles.statAmount}>
                    {formatCurrency(stat.total, primaryCurrency)}
                  </Text>
                  <Text style={styles.statPercentage}>
                    {stat.percentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))}
          </Card>

          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Last 6 Months</Text>
            <Text style={styles.chartSubtitle}>
              {selectedType === 'expense' ? 'Expenses' : 'Income'} trend
            </Text>
            <BarChart
              data={barData}
              width={screenWidth - theme.spacing.md * 4}
              height={220}
              chartConfig={chartConfig}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
              showBarTops={false}
              style={styles.barChart}
            />
          </Card>
        </>
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No data yet</Text>
          <Text style={styles.emptyDescription}>
            Start adding transactions to see analytics
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}

interface TypeButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function TypeButton({ label, active, onPress }: TypeButtonProps) {
  const React = require('react');
  const { TouchableOpacity, Text, StyleSheet } = require('react-native');

  return (
    <TouchableOpacity
      style={[
        typeButtonStyles.button,
        active && typeButtonStyles.activeButton,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        typeButtonStyles.text,
        active && typeButtonStyles.activeText,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const typeButtonStyles = StyleSheet.create({
  button: {
    flex: 1,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  activeButton: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  text: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  activeText: {
    fontWeight: '600',
    color: theme.colors.text,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  chartCard: {
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  chartTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  chartSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  barChart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  statsCard: {
    marginBottom: theme.spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  statName: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  statAmounts: {
    alignItems: 'flex-end',
  },
  statAmount: {
    ...theme.typography.bodyBold,
    color: theme.colors.text,
  },
  statPercentage: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
