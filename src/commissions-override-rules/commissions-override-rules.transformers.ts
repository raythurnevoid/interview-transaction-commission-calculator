import { transformTransactionAmountToString } from '../logic/transactions.logic';
import { CommissionOverrideRuleDto } from './dto/commissions-override-rule.dto';
import { CommissionOverrideRule } from './entities/commissions-override-rule.entity';

export function fromCreateCommissionOverrideRuleDtoToCommissionOverrideRuleEntity(
  value: Partial<CommissionOverrideRuleDto>,
): CommissionOverrideRule {
  const result = new CommissionOverrideRule({
    fixedCommission: parseFloat(value.fixed_commission),
    currency: value.currency,
    clientId: value.client_id,
  });

  return result;
}

export function fromCommissionOverrideRuleEntityToCommissionOverrideRuleDto(
  value: CommissionOverrideRule,
): CommissionOverrideRuleDto {
  const result = new CommissionOverrideRuleDto({
    fixed_commission: transformTransactionAmountToString(value.fixedCommission),
    currency: value.currency,
    client_id: value.clientId,
  });

  return result;
}
