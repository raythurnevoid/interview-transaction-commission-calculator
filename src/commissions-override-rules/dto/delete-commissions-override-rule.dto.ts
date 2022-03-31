import { PickType } from '@nestjs/mapped-types';
import { CommissionOverrideRuleDto } from './commissions-override-rule.dto';

export class DeleteCommissionOverrideRuleDto extends PickType(
  CommissionOverrideRuleDto,
  ['client_id'] as const,
) {}
