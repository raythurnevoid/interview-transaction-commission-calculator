import { TransactionDto } from './dto/transaction.dto';
import { Transaction } from './entities/transaction.entity';
import {
  fromTransactionDtoToTransactionEntity,
  fromTransactionEntityToTransactionDto,
} from './transactions.transformers';

describe('fromCreateTransactionDtoToTransactionEntity', () => {
  it('should return Transaction', () => {
    expect(
      fromTransactionDtoToTransactionEntity({
        client_id: 1,
        amount: '0.05',
        currency: 'USD',
        date: '2021-01-01',
      }),
    ).toEqual(
      new Transaction({
        clientId: 1,
        amount: 0.05,
        currency: 'USD',
        date: new Date('2021-01-01'),
      }),
    );
  });
});

describe('fromTransactionEntityToTransactionDto', () => {
  it('should return TransactionDto', () => {
    expect(
      fromTransactionEntityToTransactionDto({
        clientId: 1,
        amount: 0.05,
        currency: 'USD',
        date: new Date('2021-01-01'),
      }),
    ).toStrictEqual(
      new TransactionDto({
        client_id: 1,
        amount: '0.05',
        currency: 'USD',
        date: '2021-01-01',
      }),
    );
  });
});
