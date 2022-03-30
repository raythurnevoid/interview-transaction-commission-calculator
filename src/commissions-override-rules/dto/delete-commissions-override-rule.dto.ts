import { PickType } from '@nestjs/mapped-types';
import { SetCommissionOverrideRuleDto } from './set-commissions-override-rule.dto';

export class DeleteCommissionOverrideRuleDto extends PickType(
  SetCommissionOverrideRuleDto,
  ['client_id'] as const,
) {}
