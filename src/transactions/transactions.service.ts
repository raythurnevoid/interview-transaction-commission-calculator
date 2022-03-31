import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionDocument, Transaction } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    await new this.transactionModel(transaction).save();
    return transaction;
  }

  async findAllTransactions(): Promise<Transaction[]> {
    return await this.transactionModel.find();
  }

  async findTransactionsByClientId(clientId: number) {
    return await this.transactionModel.find({
      clientId,
    });
  }

  async getAmountByClientIdAndMonth(input: GetAmountByClientIdAndMonthInput) {
    const result = await this.transactionModel.aggregate<{
      amount: number;
    }>(this.getAmountByClientIdAndMonthAggregation(input) as any);

    return result[0]?.amount ?? 0;
  }

  getAmountByClientIdAndMonthAggregation(
    input: GetAmountByClientIdAndMonthInput,
  ) {
    return [
      {
        $match: {
          clientId: input.clientId,
        },
      },
      {
        $project: {
          amount: 1,
          month: {
            $month: '$date',
          },
        },
      },
      {
        $match: {
          month: input.date.getMonth() + 1,
        },
      },
      {
        $group: {
          _id: '$month',
          amount: {
            $sum: '$amount',
          },
        },
      },
      {
        $project: {
          _id: 0,
          amount: 1,
        },
      },
    ] as const;
  }
}

type GetAmountByClientIdAndMonthInput = Pick<Transaction, 'clientId' | 'date'>;
