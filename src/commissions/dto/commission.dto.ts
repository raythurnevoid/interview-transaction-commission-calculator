import { CreateTransactionDto } from '../../transactions/dto/create-transaction.dto';

export class CommissionDto {
  amount: CreateTransactionDto['amount'];
  currency: CreateTransactionDto['currency'];

  constructor(obj: Partial<CreateTransactionDto> = {}) {
    Object.assign(this, obj);
  }
}
