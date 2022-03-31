import { Module } from '@nestjs/common';
import { CommissionsCalculatorConfigsService } from './commissions-calculator-configs.service';
import { CommissionsCalculatorConfigsController } from './commissions-calculator-configs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommissionsCalculatorConfigs,
  CommissionsCalculatorConfigsSchema,
} from './schemas/commissions-calculator-configs.schema';
import { COMMISSIONS_CALCULATOR_MONGO_CONNECTION_NAME } from '../constants';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: CommissionsCalculatorConfigs.name,
          schema: CommissionsCalculatorConfigsSchema,
        },
      ],
      COMMISSIONS_CALCULATOR_MONGO_CONNECTION_NAME,
    ),
  ],
  controllers: [CommissionsCalculatorConfigsController],
  providers: [CommissionsCalculatorConfigsService],
  exports: [CommissionsCalculatorConfigsService],
})
export class CommissionsCalculatorConfigsModule {}
