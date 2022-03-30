import { Module } from '@nestjs/common';
import { CommissionsOverrideRulesService } from './commissions-override-rules.service';
import { CommissionOverrideRulesController } from './commissions-override-rules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommissionOverrideRule,
  CommissionOverrideRuleSchema,
} from './schemas/commissions-override-rule.schema';
import { COMMISSIONS_CALCULATOR_MONGO_CONNECTION_NAME } from '../constants';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: CommissionOverrideRule.name,
          schema: CommissionOverrideRuleSchema,
        },
      ],
      COMMISSIONS_CALCULATOR_MONGO_CONNECTION_NAME,
    ),
  ],
  controllers: [CommissionOverrideRulesController],
  providers: [CommissionsOverrideRulesService],
  exports: [CommissionsOverrideRulesService],
})
export class CommissionOverrideRulesModule {}
