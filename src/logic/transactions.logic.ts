import { TransactionDto } from '../transactions/dto/transaction.dto';

export function getTransactionAmountFormatter() {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'decimal',
    useGrouping: false,
  });

  return formatter;
}

export function transformTransactionAmountToString(
  amount: number,
): TransactionDto['amount'] {
  const formatter = getTransactionAmountFormatter();

  return formatter.format(amount) as TransactionDto['amount'];
}

export function transformDateToString(date: Date): TransactionDto['date'] {
  const parts = Intl.DateTimeFormat(['en-US'], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(date);

  const year = parts.find(({ type }) => type === 'year').value;
  const month = parts.find(({ type }) => type === 'month').value;
  const day = parts.find(({ type }) => type === 'day').value;

  return `${year}-${month}-${day}` as TransactionDto['date'];
}
