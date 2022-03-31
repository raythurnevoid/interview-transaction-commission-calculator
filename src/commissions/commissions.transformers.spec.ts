import { fromCommissionEntityToCommissionDto } from './commissions.transformers';
import { CommissionDto } from './dto/commission.dto';

describe('fromCommissionEntityToCommissionDto', () => {
  it('should return CommissionsCalculatorConfigsDto', () => {
    expect(
      fromCommissionEntityToCommissionDto({
        amount: 100,
        currency: 'USD',
      }),
    ).toStrictEqual(
      new CommissionDto({
        amount: '100.00',
        currency: 'USD',
      }),
    );
  });
});
