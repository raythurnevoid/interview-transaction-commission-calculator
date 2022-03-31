import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Matches,
} from 'class-validator';

export class TransactionDto {
  /**
   * YYYY-MM-DD format
   * @example "2021-01-01"
   **/
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: `${string}-${string}-${string}`;

  /**
   * 0.00 format
   * @example "100.00"
   * @example "200.40"
   **/
  @IsNumberString()
  @IsNotEmpty()
  @Matches(/^\d{1,}(\.\d{1,2})?$/)
  amount: `${string}.${string}`;

  /**
   * @example "EUR"
   * @example "USD"
   **/
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  client_id: number;

  constructor(obj: Partial<TransactionDto> = {}) {
    Object.assign(this, obj);
  }
}
