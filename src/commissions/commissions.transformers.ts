import { transformTransactionAmountToString } from '../logic/transactions.logic';
import { CommissionDto } from './dto/commission.dto';
import { Commission } from './entities/commission.entity';

export function fromCommissionEntityToCommissionResponseDto(
  value: Commission,
): CommissionDto {
  const result = new CommissionDto({
    amount: transformTransactionAmountToString(value.amount),
    currency: value.currency,
  });
  return result;
}
