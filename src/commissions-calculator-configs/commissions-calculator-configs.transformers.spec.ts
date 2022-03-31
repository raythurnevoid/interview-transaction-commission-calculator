import {
  fromCommissionsCalculatorConfigsDtoToCommissionsCalculatorConfigsEntity,
  fromCommissionsCalculatorConfigsEntityToCommissionsCalculatorConfigsDto,
} from './commissions-calculator-configs.transformers';
import { CommissionsCalculatorConfigsDto } from './dto/commissions-calculator-configs.dto';
import { CommissionsCalculatorConfigs } from './entities/commissions-calculator-configs.entity';

describe('fromCommissionsCalculatorConfigsDtoToCommissionsCalculatorConfigsEntity', () => {
  it('should return CommissionsCalculatorConfigs', () => {
    expect(
      fromCommissionsCalculatorConfigsDtoToCommissionsCalculatorConfigsEntity({
        commission_percentage: 0.0005,
        currency: 'USD',
        discount_commission: '0.00',
        discount_turnover_months: 1,
        minimum_commission: '0.03',
      }),
    ).toEqual(
      new CommissionsCalculatorConfigs({
        commissionPercentage: 0.0005,
        currency: 'USD',
        discountCommission: 0,
        discountTurnoverMonths: 1,
        minimumCommission: 0.03,
      }),
    );
  });
});

describe('fromCommissionsCalculatorConfigsEntityToCommissionsCalculatorConfigsDto', () => {
  it('should return CommissionsCalculatorConfigsDto', () => {
    expect(
      fromCommissionsCalculatorConfigsEntityToCommissionsCalculatorConfigsDto({
        commissionPercentage: 0.0005,
        currency: 'USD',
        discountCommission: 0,
        discountTurnoverMonths: 1,
        minimumCommission: 0.03,
      }),
    ).toStrictEqual(
      new CommissionsCalculatorConfigsDto({
        commission_percentage: 0.0005,
        currency: 'USD',
        discount_commission: '0.00',
        discount_turnover_months: 1,
        minimum_commission: '0.03',
      }),
    );
  });
});
