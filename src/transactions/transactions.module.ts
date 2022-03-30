import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { CommissionsModule } from '../commissions/commissions.module';
import { COMMISSIONS_CALCULATOR_MONGO_CONNECTION_NAME } from '../constants';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Transaction.name,
          schema: TransactionSchema,
        },
      ],
      COMMISSIONS_CALCULATOR_MONGO_CONNECTION_NAME,
    ),
    CommissionsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
