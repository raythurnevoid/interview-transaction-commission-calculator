import { transformTransactionAmountToString } from '../logic/transactions.logic';
import { CommissionsCalculatorConfigsDto } from './dto/commissions-calculator-configs.dto';
import { CommissionsCalculatorConfigs } from './entities/commissions-calculator-configs.entity';

export function fromCommissionsCalculatorConfigsDtoToCommissionsCalculatorConfigsEntity(
  value: Partial<CommissionsCalculatorConfigsDto>,
): CommissionsCalculatorConfigs {
  const result = new CommissionsCalculatorConfigs({
    minimumCommission: parseFloat(value.minimum_commission),
    discountCommission: parseFloat(value.discount_commission),
    discountTurnoverAmount: parseFloat(value.discount_turnover_amount),
    discountTurnoverMonths: Math.round(value.discount_turnover_months),
    commissionPercentage: value.commission_percentage,
    currency: value.currency,
  });

  return result;
}

export function fromCommissionsCalculatorConfigsEntityToCommissionsCalculatorConfigsDto(
  value: CommissionsCalculatorConfigs,
): CommissionsCalculatorConfigsDto {
  const result = new CommissionsCalculatorConfigsDto({
    minimum_commission: transformTransactionAmountToString(
      value.minimumCommission,
    ),
    discount_commission: transformTransactionAmountToString(
      value.discountCommission,
    ),
    discount_turnover_amount: transformTransactionAmountToString(
      value.discountTurnoverAmount,
    ),
    discount_turnover_months: value.discountTurnoverMonths,
    commission_percentage: value.commissionPercentage,
    currency: value.currency,
  });

  return result;
}
