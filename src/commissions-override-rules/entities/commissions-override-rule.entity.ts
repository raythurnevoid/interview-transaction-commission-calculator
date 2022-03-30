export class CommissionOverrideRule {
  /**
   * @example "EUR"
   * @example "USD"
   **/
  currency: string;

  fixedCommission: number;

  clientId: number;

  constructor(obj: Partial<CommissionOverrideRule> = {}) {
    Object.assign(this, obj);
  }
}
