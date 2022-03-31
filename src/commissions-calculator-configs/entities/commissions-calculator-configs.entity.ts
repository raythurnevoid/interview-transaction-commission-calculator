export class CommissionsCalculatorConfigs {
  /**
   * @example "EUR"
   * @example "USD"
   **/
  currency: string;

  minimumCommission: number;
  discountCommission: number;
  discountTurnoverMonths: number;
  discountTurnoverAmount: number;
  commissionPercentage: number;

  constructor(obj: Partial<CommissionsCalculatorConfigs> = {}) {
    Object.assign(this, obj);
  }
}
