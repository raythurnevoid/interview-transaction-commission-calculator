import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommissionsCalculatorConfigsDocument,
  CommissionsCalculatorConfigs,
} from './schemas/commissions-calculator-configs.schema';

@Injectable()
export class CommissionsCalculatorConfigsService {
  constructor(
    @InjectModel(CommissionsCalculatorConfigs.name)
    private commissionsCalculatorConfigsModel: Model<CommissionsCalculatorConfigsDocument>,
  ) {}

  async setConfigs(
    commissionsCalculatorConfigs: CommissionsCalculatorConfigs,
  ): Promise<void> {
    await this.commissionsCalculatorConfigsModel.findOneAndUpdate(
      {},
      commissionsCalculatorConfigs,
      {
        new: true,
        upsert: true,
      },
    );
  }

  async getConfigs(): Promise<CommissionsCalculatorConfigs> {
    return await this.commissionsCalculatorConfigsModel.findOne();
  }
}
