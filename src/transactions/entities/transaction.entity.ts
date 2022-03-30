export class Transaction {
  date: Date;

  amount: number;

  /**
   * @example "EUR"
   * @example "USD"
   **/
  currency: string;

  clientId: number;

  constructor(obj: Partial<Transaction> = {}) {
    Object.assign(this, obj);
  }
}
