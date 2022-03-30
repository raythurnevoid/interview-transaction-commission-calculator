import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transaction as TransactionEntity } from '../entities/transaction.entity';

export type TransactionDocument = Transaction & Document;

@Schema({
  collection: 'transactions',
})
export class Transaction {
  @Prop({
    type: Date,
  })
  date: TransactionEntity['date'];

  @Prop({
    type: Number,
  })
  amount: TransactionEntity['amount'];

  @Prop({
    type: String,
  })
  currency: TransactionEntity['currency'];

  @Prop({
    type: Number,
  })
  clientId: TransactionEntity['clientId'];
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
