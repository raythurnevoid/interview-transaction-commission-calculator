import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from './transactions/transactions.module';
import { CommissionsModule } from './commissions/commissions.module';
import { CommissionOverrideRulesModule } from './commissions-override-rules/commissions-override-rules.module';
import { CommissionsCalculatorConfigsModule } from './commissions-calculator-configs/commissions-override-rules.module';
import { COMMISSIONS_CALCULATOR_MONGO_CONNECTION_NAME } from './constants';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot('mongodb://mongo/commission-calculator', {
      connectionName: COMMISSIONS_CALCULATOR_MONGO_CONNECTION_NAME,
    }),
    CommissionOverrideRulesModule,
    CommissionsModule,
    TransactionsModule,
    CommissionsCalculatorConfigsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
