import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CommissionsCalculatorConfigsModule } from '../commissions-calculator-configs/commissions-calculator-configs.module';
import { CommissionOverrideRulesModule } from '../commissions-override-rules/commissions-override-rules.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { CommissionsController } from './commissions.controller';
import { CommissionsService } from './commissions.service';

@Module({
  imports: [
    HttpModule,
    CommissionOverrideRulesModule,
    forwardRef(() => TransactionsModule),
    CommissionsCalculatorConfigsModule,
  ],
  controllers: [CommissionsController],
  providers: [CommissionsService],
  exports: [CommissionsService],
})
export class CommissionsModule {}
