import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { TransactionWithDetails } from '../types';
import { formatDate } from './date';

export async function exportTransactionsToCSV(transactions: TransactionWithDetails[]): Promise<void> {
  const headers = [
    'Date',
    'Type',
    'Description',
    'Amount',
    'Currency',
    'Converted Amount (Primary Currency)',
    'Category',
    'Payment Method'
  ];

  const rows = transactions.map(t => [
    formatDate(t.date),
    t.type,
    t.description,
    t.amount.toFixed(2),
    t.currency,
    t.convertedAmount.toFixed(2),
    t.category.name,
    t.paymentMethod.name
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const timestamp = Date.now();
  const fileName = `transactions_${timestamp}.csv`;
  const file = new File(Paths.document, fileName);

  await file.write(csvContent);

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export Transactions',
      UTI: 'public.comma-separated-values-text',
    });
  } else {
    throw new Error('Sharing is not available on this device');
  }
}
