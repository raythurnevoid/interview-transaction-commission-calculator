import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CommissionsCalculatorConfigsService } from '../commissions-calculator-configs/commissions-calculator-configs.service';
import { CommissionsOverrideRulesService } from '../commissions-override-rules/commissions-override-rules.service';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { Commission } from './entities/commission.entity';
import { lastValueFrom } from 'rxjs';
import { CommissionsCalculatorConfigs } from '../commissions-calculator-configs/schemas/commissions-calculator-configs.schema';

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

    if (!configs?.commissionPercentage || !configs?.currency) {
      throw new InternalServerErrorException('Commissions not configured');
    }

    const amount = await this.getAmountInConfiguredCurrency({
      input,
      configs,
    });

    const inputInConfiguredCurrency = new Transaction({
      ...input,
      amount: amount,
    });

    let commission: number;

    const commissionOverrideRule =
      await this.findCommissionOverrideRuleByClientId({
        clientId: inputInConfiguredCurrency.clientId,
        configs,
      });

    const discountedCommission =
      await this.getTurnoverDiscountedCommissionAmount({
        configs,
        transaction: inputInConfiguredCurrency,
      });

    if (discountedCommission) {
      commission = discountedCommission;
    } else {
      commission = this.calculatePercentage(
        amount,
        configs.commissionPercentage,
      );

      //? Should this rule apply only when calculating with percentage or also on commissionOverrideRule?
      if (commission < configs.minimumCommission) {
        commission = configs.minimumCommission;
      }
    }

    if (commissionOverrideRule != null && commission > commissionOverrideRule) {
      commission = commissionOverrideRule;
    }

    return new Commission({
      amount: commission,
      currency: configs.currency,
    });
  }

  async getTurnoverDiscountedCommissionAmount({
    configs,
    transaction,
  }: {
    configs: CommissionsCalculatorConfigs;
    transaction: Transaction;
  }) {
    let discountedCommission: number = null;
    if (configs.discountTurnoverAmount && configs.discountTurnoverMonths) {
      const totalMonthsAmount =
        await this.getTotalTransactionsAmountFromPastMonths({
          configs,
          transaction: transaction,
        });

      if (totalMonthsAmount < configs.discountTurnoverAmount) {
        return null;
      } else {
        discountedCommission = configs.discountCommission;
      }
    }
    return discountedCommission;
  }

  async getTotalTransactionsAmountFromPastMonths({
    configs,
    transaction,
  }: {
    configs: CommissionsCalculatorConfigs;
    transaction: Transaction;
  }) {
    let totalMonthAmount = 0;
    if (configs.discountTurnoverMonths) {
      // TODO: Refactor to provide a range of dates to mongo
      totalMonthAmount = await Promise.all(
        Array.from(Array(configs.discountTurnoverMonths).keys()).map(
          async (monthAgo) =>
            await this.transactionsService.getAmountByClientIdAndMonth({
              clientId: transaction.clientId,
              date: new Date(
                Date.UTC(
                  transaction.date.getFullYear(),
                  transaction.date.getMonth() - monthAgo,
                ),
              ),
            }),
        ),
      ).then((amounts) => {
        return amounts.reduce((a, b) => a + b, 0);
      });
    }
    return totalMonthAmount;
  }

  async getAmountInConfiguredCurrency({
    input,
    configs,
  }: {
    input: Pick<Transaction, 'amount' | 'currency'>;
    configs: CommissionsCalculatorConfigs;
  }) {
    let amount: number = null;
    if (configs.currency !== input.currency) {
      const currenciesRates = await this.fetchCurrencyRates();
      if (
        input.currency !== configs.currency &&
        !currenciesRates[input.currency]
      ) {
        throw new BadRequestException(`Invalid currency ${configs.currency}`);
      }
      amount =
        (input.amount / currenciesRates[input.currency]) *
        currenciesRates[configs.currency];
    } else {
      amount = input.amount;
    }

    return amount;
  }

  async findCommissionOverrideRuleByClientId({
    clientId,
    configs,
  }: {
    clientId: number;
    configs: CommissionsCalculatorConfigs;
  }) {
    let commissionAmountInConfiguredCurrency: number = null;

    const commissionOverrideRule =
      await this.commissionsOverrideRulesService.findCommissionOverrideRuleByClientId(
        clientId,
      );

    if (commissionOverrideRule) {
      commissionAmountInConfiguredCurrency =
        await this.getAmountInConfiguredCurrency({
          input: {
            amount: commissionOverrideRule.fixedCommission,
            currency: commissionOverrideRule.currency,
          },
          configs,
        });
    }

    return commissionAmountInConfiguredCurrency;
  }

  /**
   * Calculate percentage rounded to second fraction number
   */
  calculatePercentage(amount: number, percentage: number): number {
    const result = amount * percentage;
    const rounded = this.roundAmount(result);
    return rounded;
  }

  roundAmount(amount: number): number {
    return Math.round(amount * 100) / 100;
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
