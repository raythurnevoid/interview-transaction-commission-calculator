import { transformTransactionAmountToString } from '../logic/transactions.logic';
import { SetCommissionOverrideRuleDto } from './dto/set-commissions-override-rule.dto';
import { CommissionOverrideRule } from './entities/commissions-override-rule.entity';

export function fromCreateCommissionOverrideRuleDtoToCommissionOverrideRuleEntity(
  value: Partial<SetCommissionOverrideRuleDto>,
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
): SetCommissionOverrideRuleDto {
  const result = new SetCommissionOverrideRuleDto({
    fixed_commission: transformTransactionAmountToString(value.fixedCommission),
    currency: value.currency,
    client_id: value.clientId,
  });

  return result;
}
