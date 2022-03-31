import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommissionOverrideRuleDocument,
  CommissionOverrideRule,
} from './schemas/commissions-override-rule.schema';

@Injectable()
export class CommissionsOverrideRulesService {
  constructor(
    @InjectModel(CommissionOverrideRule.name)
    private commissionOverrideRuleModel: Model<CommissionOverrideRuleDocument>,
  ) {}

  async createCommissionOverrideRule(
    commissionOverrideRule: CommissionOverrideRule,
  ): Promise<CommissionOverrideRule> {
    const createdCommissionOverrideRule =
      await this.commissionOverrideRuleModel.findOneAndUpdate(
        {
          clientId: commissionOverrideRule.clientId,
        },
        commissionOverrideRule,
        {
          new: true,
          upsert: true,
        },
      );

    return createdCommissionOverrideRule;
  }

  async deleteCommissionOverrideRule(
    commissionOverrideRule: Pick<CommissionOverrideRule, 'clientId'>,
  ): Promise<void> {
    await this.commissionOverrideRuleModel.findOneAndRemove({
      clientId: commissionOverrideRule.clientId,
    });
  }

  async findAllCommissionOverrideRules(): Promise<CommissionOverrideRule[]> {
    return await this.commissionOverrideRuleModel.find();
  }

  async findCommissionOverrideRuleByClientId(
    clientId: number,
  ): Promise<CommissionOverrideRule> {
    return await this.commissionOverrideRuleModel.findOne({
      clientId,
    });
  }
}
