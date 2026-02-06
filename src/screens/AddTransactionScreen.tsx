import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useStore } from '../store';
import { theme } from '../theme';
import { Button, Input, Picker } from '../components';
import { RootStackParamList } from '../navigation/types';
import { Currency, TransactionType } from '../types';
import { convertCurrency, CURRENCY_SYMBOLS } from '../utils/currency';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTransaction'>;
type RoutePropType = RouteProp<RootStackParamList, 'EditTransaction'>;

export default function AddTransactionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const transactionId = route.params?.transactionId;
  const isEditing = !!transactionId;

  const {
    primaryCurrency,
    categories,
    paymentMethods,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useStore();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>(primaryCurrency);
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(Date.now());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const transaction = transactions.find(t => t.id === transactionId);
      if (transaction) {
        setType(transaction.type);
        setAmount(transaction.amount.toString());
        setCurrency(transaction.currency);
        setCategoryId(transaction.categoryId);
        setPaymentMethodId(transaction.paymentMethodId);
        setDescription(transaction.description);
        setDate(transaction.date);
      }
    } else {
      const defaultPaymentMethod = paymentMethods.find(pm => pm.isDefault);
      if (defaultPaymentMethod) {
        setPaymentMethodId(defaultPaymentMethod.id);
      }
    }
  }, [isEditing, transactionId, transactions, paymentMethods]);

  const filteredCategories = categories.filter(c => c.type === type);

  useEffect(() => {
    if (filteredCategories.length > 0 && !categoryId) {
      setCategoryId(filteredCategories[0].id);
    }
  }, [filteredCategories, categoryId]);

  const handleSave = async () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!categoryId || !paymentMethodId) {
      Alert.alert('Error', 'Please select category and payment method');
      return;
    }

    setLoading(true);
    try {
      const convertedAmount = convertCurrency(amountNum, currency, primaryCurrency);

      if (isEditing) {
        await updateTransaction(transactionId, {
          type,
          amount: amountNum,
          currency,
          convertedAmount,
          categoryId,
          paymentMethodId,
          description,
          date,
        });
      } else {
        await addTransaction({
          id: `txn-${Date.now()}`,
          type,
          amount: amountNum,
          currency,
          convertedAmount,
          categoryId,
          paymentMethodId,
          description,
          date,
          isRecurring: false,
        });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transactionId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete transaction');
            }
          },
        },
      ]
    );
  };

  const currencyOptions = Object.keys(CURRENCY_SYMBOLS).map(curr => ({
    label: `${curr} (${CURRENCY_SYMBOLS[curr as Currency]})`,
    value: curr,
  }));

  const categoryOptions = filteredCategories.map(cat => ({
    label: cat.name,
    value: cat.id,
  }));

  const paymentMethodOptions = paymentMethods.map(pm => ({
    label: pm.name,
    value: pm.id,
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.typeSelector}>
          <TypeButton
            label="Expense"
            active={type === 'expense'}
            onPress={() => {
              setType('expense');
              setCategoryId('');
            }}
          />
          <TypeButton
            label="Income"
            active={type === 'income'}
            onPress={() => {
              setType('income');
              setCategoryId('');
            }}
          />
        </View>

        <Input
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />

        <Picker
          label="Currency"
          value={currency}
          options={currencyOptions}
          onValueChange={(value) => setCurrency(value as Currency)}
        />

        <Picker
          label="Category"
          value={categoryId}
          options={categoryOptions}
          onValueChange={setCategoryId}
        />

        <Picker
          label="Payment Method"
          value={paymentMethodId}
          options={paymentMethodOptions}
          onValueChange={setPaymentMethodId}
        />

        <Input
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Add a note..."
          multiline
          numberOfLines={3}
        />

        <View style={styles.actions}>
          <Button
            title={isEditing ? 'Update' : 'Add Transaction'}
            onPress={handleSave}
            loading={loading}
          />

          {isEditing && (
            <Button
              title="Delete"
              onPress={handleDelete}
              variant="danger"
              style={styles.deleteButton}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface TypeButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function TypeButton({ label, active, onPress }: TypeButtonProps) {
  return (
    <Button
      title={label}
      onPress={onPress}
      variant={active ? 'primary' : 'secondary'}
      style={styles.typeButton}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  typeButton: {
    flex: 1,
  },
  actions: {
    marginTop: theme.spacing.lg,
  },
  deleteButton: {
    marginTop: theme.spacing.md,
  },
});
