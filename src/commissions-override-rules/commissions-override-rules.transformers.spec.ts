import {
  fromCommissionOverrideRuleEntityToCommissionOverrideRuleDto,
  fromCreateCommissionOverrideRuleDtoToCommissionOverrideRuleEntity,
} from './commissions-override-rules.transformers';
import { CommissionOverrideRuleDto } from './dto/commissions-override-rule.dto';
import { CommissionOverrideRule } from './entities/commissions-override-rule.entity';

describe('fromCreateCommissionOverrideRuleDtoToCommissionOverrideRuleEntity', () => {
  it('should return CommissionOverrideRule', () => {
    expect(
      fromCreateCommissionOverrideRuleDtoToCommissionOverrideRuleEntity({
        client_id: 1,
        fixed_commission: '0.05',
        currency: 'USD',
      }),
    ).toEqual(
      new CommissionOverrideRule({
        clientId: 1,
        fixedCommission: 0.05,
        currency: 'USD',
      }),
    );
  });
});

describe('fromCommissionOverrideRuleEntityToCommissionOverrideRuleDto', () => {
  it('should return CommissionOverrideRuleDto', () => {
    expect(
      fromCommissionOverrideRuleEntityToCommissionOverrideRuleDto({
        clientId: 1,
        fixedCommission: 0.05,
        currency: 'USD',
      }),
    ).toStrictEqual(
      new CommissionOverrideRuleDto({
        client_id: 1,
        fixed_commission: '0.05',
        currency: 'USD',
      }),
    );
  });
});
