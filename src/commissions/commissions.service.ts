import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CommissionsCalculatorConfigsService } from '../commissions-calculator-configs/commissions-override-rules.service';
import { CommissionsOverrideRulesService } from '../commissions-override-rules/commissions-override-rules.service';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { Commission } from './entities/commission.entity';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CommissionsService {
  private currenciesRates: {
    [currency: string]: number;
  };

  constructor(
    private readonly commissionsOverrideRulesService: CommissionsOverrideRulesService,
    private readonly transactionsService: TransactionsService,
    private readonly commissionsCalculatorConfigsService: CommissionsCalculatorConfigsService,
    private readonly httpService: HttpService,
  ) {}

  async getCommission(input: Transaction): Promise<Commission> {
    const configs = await this.commissionsCalculatorConfigsService.getConfigs();

    if (!configs) {
      throw new InternalServerErrorException('Commissions not configured');
    }

    let amount: number;
    if (configs.currency !== input.currency) {
      const currenciesRates = await this.fetchCurrencyRates();
      if (
        input.currency !== configs.currency &&
        !currenciesRates[input.currency]
      ) {
        throw new BadRequestException(`Invalid currency ${configs.currency}`);
      }
      amount = input.amount / currenciesRates[input.currency];
    } else {
      amount = input.amount;
    }

    let commission: number;

    const commissionOverrideRule =
      await this.commissionsOverrideRulesService.findByClientId(input.clientId);

    let totalMonthAmount = 0;
    if (configs.discountTurnoverMonths) {
      totalMonthAmount = await Promise.all(
        Array.from(Array(configs.discountTurnoverMonths).keys()).map(
          async (monthAgo) =>
            await this.transactionsService.getAmountByClientIdAndMonth({
              clientId: input.clientId,
              date: new Date(
                input.date.getFullYear(),
                input.date.getMonth() - monthAgo,
                input.date.getDate(),
              ),
            }),
        ),
      ).then((amounts) => amounts.reduce((a, b) => a + b, 0));
    }

    if (!totalMonthAmount) {
      commission = this.calculatePercentage(
        amount,
        configs.commissionPercentage,
      );
      if (commission < configs.minimumCommission) {
        commission = configs.minimumCommission;
      }
    } else {
      commission = configs.discountCommission;
    }

    if (
      commissionOverrideRule &&
      commission > commissionOverrideRule.fixedCommission
    ) {
      commission = commissionOverrideRule.fixedCommission;
    }

    return new Commission({
      amount: commission,
      currency: configs.currency,
    });
  }

  /**
   * Calculate percentage rounded to second fraction number
   */
  calculatePercentage(amount: number, percentage: number): number {
    const result = amount * percentage;
    const rounded = this.floorAmount(result);
    return rounded;
  }

  floorAmount(amount: number): number {
    return Math.floor(amount * 100) / 100;
  }

  async fetchCurrencyRates(): Promise<any> {
    if (!this.currenciesRates) {
      const r = await lastValueFrom(
        this.httpService.get('https://api.exchangerate.host/2021-01-01'),
      );

      this.currenciesRates = r.data.rates;
    }

    return this.currenciesRates;
  }
}
