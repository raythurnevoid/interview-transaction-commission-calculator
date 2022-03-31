import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CommissionsCalculatorConfigs as CommissionsCalculatorConfigsEntity } from '../entities/commissions-calculator-configs.entity';

export type CommissionsCalculatorConfigsDocument =
  CommissionsCalculatorConfigsEntity & Document;

@Schema({
  collection: 'configs',
})
export class CommissionsCalculatorConfigs {
  @Prop({
    type: Number,
  })
  minimumCommission: CommissionsCalculatorConfigsEntity['minimumCommission'];

  @Prop({
    type: Number,
  })
  discountCommission: CommissionsCalculatorConfigsEntity['discountCommission'];

  @Prop({
    type: Number,
  })
  discountTurnoverMonths: CommissionsCalculatorConfigsEntity['discountTurnoverMonths'];

  @Prop({
    type: Number,
  })
  discountTurnoverAmount: CommissionsCalculatorConfigsEntity['discountTurnoverAmount'];

  @Prop({
    type: Number,
  })
  commissionPercentage: CommissionsCalculatorConfigsEntity['commissionPercentage'];

  @Prop({
    type: String,
  })
  currency: CommissionsCalculatorConfigsEntity['currency'];
}

export const CommissionsCalculatorConfigsSchema = SchemaFactory.createForClass(
  CommissionsCalculatorConfigs,
);
