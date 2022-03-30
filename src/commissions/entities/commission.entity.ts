import { Transaction } from '../../transactions/entities/transaction.entity';

export class Commission {
  amount: Transaction['amount'];
  currency: Transaction['currency'];

  constructor(obj: Partial<Transaction> = {}) {
    Object.assign(this, obj);
  }
}
