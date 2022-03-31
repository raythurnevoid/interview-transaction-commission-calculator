import {
  transformDateToString,
  transformTransactionAmountToString,
} from '../logic/transactions.logic';
import { TransactionDto } from './dto/transaction.dto';
import { Transaction } from './entities/transaction.entity';

export function fromTransactionDtoToTransactionEntity(
  value: TransactionDto,
): Transaction {
  const result = new Transaction({
    date: new Date(value.date),
    amount: parseFloat(value.amount),
    currency: value.currency,
    clientId: value.client_id,
  });

  return result;
}

export function fromTransactionEntityToTransactionDto(
  value: Transaction,
): TransactionDto {
  const result = new TransactionDto({
    date: transformDateToString(value.date),
    amount: transformTransactionAmountToString(value.amount),
    currency: value.currency,
    client_id: value.clientId,
  });

  return result;
}
