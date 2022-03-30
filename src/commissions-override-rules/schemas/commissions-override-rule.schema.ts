import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CommissionOverrideRule as CommissionOverrideRuleEntity } from '../entities/commissions-override-rule.entity';

export type CommissionOverrideRuleDocument = CommissionOverrideRuleEntity &
  Document;

@Schema({
  collection: 'commissions-override-rules',
})
export class CommissionOverrideRule {
  @Prop({
    type: Number,
  })
  fixedCommission: CommissionOverrideRuleEntity['fixedCommission'];

  @Prop({
    type: String,
  })
  currency: CommissionOverrideRuleEntity['currency'];

  @Prop({
    type: Number,
  })
  clientId: CommissionOverrideRuleEntity['clientId'];
}

export const CommissionOverrideRuleSchema = SchemaFactory.createForClass(
  CommissionOverrideRule,
);
