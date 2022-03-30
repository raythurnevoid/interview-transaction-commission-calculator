import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionDocument, Transaction } from './schemas/transaction.schema';
import { Commission } from '../commissions/entities/commission.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(transaction: Commission): Promise<Transaction> {
    const createdTransaction = new this.transactionModel(transaction);
    return createdTransaction.save();
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

  async findByClientId(clientId: number) {
    return this.transactionModel
      .find({
        clientId,
      })
      .exec();
  }

  async getAmountByClientIdAndMonth(
    input: Pick<Transaction, 'clientId' | 'date'>,
  ) {
    const result = await this.transactionModel.aggregate<{
      amount: number;
    }>([
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
    ]);

    return result[0]?.amount;
  }
}
