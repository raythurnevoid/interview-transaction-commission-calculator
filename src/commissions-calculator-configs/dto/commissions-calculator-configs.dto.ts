import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { TransactionDto } from '../../transactions/dto/transaction.dto';

export class CommissionsCalculatorConfigsDto {
  @IsNumberString()
  @IsNotEmpty()
  minimum_commission: TransactionDto['amount'];

  @IsNumberString()
  @IsNotEmpty()
  discount_commission: TransactionDto['amount'];

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsNotEmpty()
  commission_percentage: number;

  @IsNumber()
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  discount_turnover_months: number;

  @IsNumberString()
  @IsNotEmpty()
  discount_turnover_amount: TransactionDto['amount'];

  /**
   * Base currency of the commissions calculator.
   *
   * @example "EUR"
   * @example "USD"
   **/
  @IsString()
  @IsNotEmpty()
  currency: TransactionDto['currency'];

  constructor(obj: Partial<CommissionsCalculatorConfigsDto> = {}) {
    Object.assign(this, obj);
  }
}
