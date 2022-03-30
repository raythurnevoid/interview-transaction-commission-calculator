import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Matches,
} from 'class-validator';

export class SetCommissionOverrideRuleDto {
  /**
   * @example "EUR"
   * @example "USD"
   **/
  @IsString()
  @IsNotEmpty()
  currency: string;

  /**
   * 0.00 format
   * @example "100.00"
   * @example "200.40"
   **/
  @IsNumberString()
  @IsNotEmpty()
  @Matches(/^\d{1,}(\.\d{1,2})?$/)
  fixed_commission: `${string}.${string}`;

  @IsNumber()
  client_id: number;

  constructor(obj: Partial<SetCommissionOverrideRuleDto> = {}) {
    Object.assign(this, obj);
  }
}
