import {
  transformDateToString,
  transformTransactionAmountToString,
} from '../logic/transactions.logic';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

export function fromCreateTransactionDtoToTransactionEntity(
  value: CreateTransactionDto,
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
): CreateTransactionDto {
  const result = new CreateTransactionDto({
    date: transformDateToString(value.date),
    amount: transformTransactionAmountToString(value.amount),
    currency: value.currency,
    client_id: value.clientId,
  });

  return result;
}
