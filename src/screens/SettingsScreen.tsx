import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useStore } from '../store';
import { theme } from '../theme';
import { Card, Button, Picker } from '../components';
import { Currency } from '../types';
import { CURRENCY_SYMBOLS } from '../utils/currency';
import { exportTransactionsToCSV } from '../utils/csv';

export default function SettingsScreen() {
  const { primaryCurrency, transactions, setPrimaryCurrency } = useStore();
  const [exporting, setExporting] = useState(false);

  const handleCurrencyChange = async (newCurrency: string) => {
    Alert.alert(
      'Change Primary Currency',
      'Changing your primary currency will affect how all transactions are displayed. Past transactions will be converted using current exchange rates.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: async () => {
            await setPrimaryCurrency(newCurrency as Currency);
            Alert.alert('Success', 'Primary currency updated');
          },
        },
      ]
    );
  };

  const handleExport = async () => {
    if (transactions.length === 0) {
      Alert.alert('No Data', 'There are no transactions to export');
      return;
    }

    setExporting(true);
    try {
      await exportTransactionsToCSV(transactions);
      Alert.alert('Success', 'Transactions exported successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to export transactions');
    } finally {
      setExporting(false);
    }
  };

  const currencyOptions = Object.keys(CURRENCY_SYMBOLS).map(curr => ({
    label: `${curr} (${CURRENCY_SYMBOLS[curr as Currency]})`,
    value: curr,
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <Picker
          label="Primary Currency"
          value={primaryCurrency}
          options={currencyOptions}
          onValueChange={handleCurrencyChange}
        />
        <Text style={styles.hint}>
          All transactions will be converted to this currency for totals and analytics
        </Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <Button
          title="Export to CSV"
          onPress={handleExport}
          loading={exporting}
          variant="secondary"
        />
        <Text style={styles.hint}>
          Export all your transactions as a CSV file
        </Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <StatRow label="Total Transactions" value={transactions.length.toString()} />
        <StatRow
          label="Income Transactions"
          value={transactions.filter(t => t.type === 'income').length.toString()}
        />
        <StatRow
          label="Expense Transactions"
          value={transactions.filter(t => t.type === 'expense').length.toString()}
        />
      </Card>

      <Card style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>Finance Tracker</Text>
        <Text style={styles.aboutVersion}>Version 1.0.0</Text>
        <Text style={styles.aboutDescription}>
          A local-first personal finance app for tracking expenses and income across multiple currencies
        </Text>
      </Card>
    </ScrollView>
  );
}

interface StatRowProps {
  label: string;
  value: string;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  hint: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  statValue: {
    ...theme.typography.bodyBold,
    color: theme.colors.text,
  },
  aboutCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  aboutTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  aboutVersion: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  aboutDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
