import { TransactionDto } from '../../transactions/dto/transaction.dto';

export class CommissionDto {
  amount: TransactionDto['amount'];
  currency: TransactionDto['currency'];

  constructor(obj: Partial<TransactionDto> = {}) {
    Object.assign(this, obj);
  }
}
