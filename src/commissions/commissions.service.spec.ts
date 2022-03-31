import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsController } from './commissions.controller';
import { CommissionsService } from './commissions.service';
import { Transaction } from '../transactions/entities/transaction.entity';
import { CommissionsCalculatorConfigsService } from '../commissions-calculator-configs/commissions-calculator-configs.service';
import { TransactionsService } from '../transactions/transactions.service';
import { CommissionsOverrideRulesService } from '../commissions-override-rules/commissions-override-rules.service';
import { CommissionsCalculatorConfigs } from '../commissions-calculator-configs/schemas/commissions-calculator-configs.schema';
import { CommissionOverrideRule } from '../commissions-override-rules/schemas/commissions-override-rule.schema';

describe('CommissionsService', () => {
  let service: CommissionsService;
  let module: TestingModule;

  afterEach(async () => {
    await module.close();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    module = await Test.createTestingModule({
      imports: [],
      controllers: [CommissionsController],
      providers: [
        CommissionsService,
        {
          provide: CommissionsOverrideRulesService,
          useValue: {
            findCommissionOverrideRuleByClientId: jest.fn(
              (): CommissionOverrideRule => {
                return undefined;
              },
            ),
          },
        },
        {
          provide: CommissionsCalculatorConfigsService,
          useValue: {
            getConfigs: jest.fn((): CommissionsCalculatorConfigs => {
              return {
                minimumCommission: 0.05,
                discountCommission: 0.03,
                discountTurnoverMonths: 1,
                discountTurnoverAmount: 1000,
                commissionPercentage: 0.0005,
                currency: 'EUR',
              };
            }),
          },
        },
        {
          provide: TransactionsService,
          useValue: {
            getAmountByClientIdAndMonth: jest.fn(() => {
              return 0;
            }),
          },
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get(CommissionsService);

    jest.spyOn(service, 'fetchCurrencyRates').mockReturnValue(
      Promise.resolve({
        USD: 2,
        EUR: 1,
        GBP: 0.5,
      }),
    );

    jest
      .spyOn(service, 'findCommissionOverrideRuleByClientId')
      .mockReturnValue(Promise.resolve(undefined));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculatePercentage', () => {
    test.each([
      {
        percentage: 0.5,
        amount: 100,
        expected: 0.5,
      },
      {
        percentage: 0.5,
        amount: 200.4,
        expected: 1,
      },
      {
        percentage: 0.5,
        amount: 499,
        expected: 2.5,
      },
    ])(
      '$percentage% of $amount is $expected',
      ({ percentage, amount, expected }) => {
        expect(service.calculatePercentage(amount, percentage / 100)).toBe(
          expected,
        );
      },
    );
  });

  describe('getCommission', () => {
    it('should thrown "Commissions not configured" when commissionsCalculatorConfigsService.getConfigs returns null', async () => {
      const commissionsCalculatorConfigsService = module.get(
        CommissionsCalculatorConfigsService,
      );
      jest
        .spyOn(commissionsCalculatorConfigsService as any, 'getConfigs')
        .mockReturnValue(null);
      expect(
        service.getCommission(
          new Transaction({
            clientId: 1,
            amount: 100,
            currency: 'EUR',
            date: new Date('2021-01-01'),
          }),
        ),
      ).rejects.toThrowError('Commissions not configured');
    });

    it('should thrown "Commissions not configured" when commissionsCalculatorConfigsService.getConfigs returns no commissionPercentage', async () => {
      const commissionsCalculatorConfigsService = module.get(
        CommissionsCalculatorConfigsService,
      );
      jest
        .spyOn(commissionsCalculatorConfigsService as any, 'getConfigs')
        .mockReturnValue({
          minimumCommission: 0.05,
          discountCommission: 0.03,
          discountTurnoverMonths: 1,
          discountTurnoverAmount: 1000,
          currency: 'EUR',
        });
      expect(
        service.getCommission(
          new Transaction({
            clientId: 1,
            amount: 100,
            currency: 'EUR',
            date: new Date('2021-01-01'),
          }),
        ),
      ).rejects.toThrowError('Commissions not configured');
    });

    it('should thrown "Commissions not configured" when commissionsCalculatorConfigsService.getConfigs returns no currency', async () => {
      const commissionsCalculatorConfigsService = module.get(
        CommissionsCalculatorConfigsService,
      );
      jest
        .spyOn(commissionsCalculatorConfigsService as any, 'getConfigs')
        .mockReturnValue({
          minimumCommission: 0.05,
          discountCommission: 0.03,
          discountTurnoverMonths: 1,
          discountTurnoverAmount: 1000,
          commissionPercentage: 0.0005,
        });

      expect(
        service.getCommission(
          new Transaction({
            clientId: 1,
            amount: 100,
            currency: 'EUR',
            date: new Date('2021-01-01'),
          }),
        ),
      ).rejects.toThrowError('Commissions not configured');
    });

    it('should return commission with amount equal to the value returned from findCommissionOverrideRuleByClientId when a override rule is found', async () => {
      jest
        .spyOn(service as any, 'findCommissionOverrideRuleByClientId')
        .mockReturnValue(0.04);

      const result = await service.getCommission(
        new Transaction({
          clientId: 1,
          amount: 100,
          currency: 'EUR',
          date: new Date('2021-01-01'),
        }),
      );

      expect(result).toEqual({
        amount: 0.04,
        currency: 'EUR',
      });
    });

    it('should return commission with amount equal to the value returned from getTurnoverDiscountedCommissionAmount when turnover is reached', async () => {
      jest
        .spyOn(service as any, 'getTurnoverDiscountedCommissionAmount')
        .mockReturnValue(0.03);

      const result = await service.getCommission(
        new Transaction({
          clientId: 1,
          amount: 100,
          currency: 'EUR',
          date: new Date('2021-01-01'),
        }),
      );

      expect(result).toEqual({
        amount: 0.03,
        currency: 'EUR',
      });
    });

    it('should calculate commission with configs.commissionPercentage when neither there is no override rule and the turnover has not bean reached', async () => {
      const commissionsCalculatorConfigsService = module.get(
        CommissionsCalculatorConfigsService,
      );
      jest
        .spyOn(commissionsCalculatorConfigsService as any, 'getConfigs')
        .mockReturnValue({
          commissionPercentage: 0.01,
          minimumCommission: 0.05,
          discountCommission: 0.03,
          discountTurnoverMonths: 1,
          discountTurnoverAmount: 1000,
          currency: 'EUR',
        });

      const result = await service.getCommission(
        new Transaction({
          clientId: 1,
          amount: 100,
          currency: 'EUR',
          date: new Date('2021-01-01'),
        }),
      );

      expect(result).toEqual({
        amount: 1,
        currency: 'EUR',
      });
    });

    test("commission calculated by percentage shouldn't be lower than the configured minimumCommission", async () => {
      const commissionsCalculatorConfigsService = module.get(
        CommissionsCalculatorConfigsService,
      );
      jest
        .spyOn(commissionsCalculatorConfigsService as any, 'getConfigs')
        .mockReturnValue({
          commissionPercentage: 0.01,
          minimumCommission: 10,
          discountCommission: 0.03,
          discountTurnoverMonths: 1,
          discountTurnoverAmount: 1000,
          currency: 'EUR',
        });

      const result = await service.getCommission(
        new Transaction({
          clientId: 1,
          amount: 100,
          currency: 'EUR',
          date: new Date('2021-01-01'),
        }),
      );

      expect(result).toEqual({
        amount: 10,
        currency: 'EUR',
      });
    });

    test.each([
      {
        amount: 100,
        currency: 'EUR',
        expected: 0.05,
        date: new Date('2021-01-01'),
        clientId: 1,
      },
      {
        amount: 90,
        currency: 'EUR',
        expected: 0.05,
        date: new Date('2021-01-01'),
        clientId: 1,
      },
      {
        amount: 200.4,
        currency: 'EUR',
        expected: 0.1,
        date: new Date('2021-01-01'),
        clientId: 1,
      },
      {
        amount: 200,
        currency: 'USD',
        expected: 0.05,
        date: new Date('2021-01-01'),
        clientId: 1,
      },
    ])(
      'should return $expected when amount is $amount and currency is $currency',
      async ({ expected, ...input }) => {
        const result = await service.getCommission(input as Transaction);
        expect(result).toEqual({
          amount: expected,
          currency: 'EUR',
        });
      },
    );
  });

  describe('getAmountInConfiguredCurrency', () => {
    it('should return input.amount when transaction.currency is equal to configs.currency', async () => {
      const transaction = new Transaction({
        amount: 100,
        currency: 'EUR',
      });
      const result = await service.getAmountInConfiguredCurrency({
        input: transaction,
        configs: {
          currency: 'EUR',
        } as CommissionsCalculatorConfigs,
      });
      expect(result).toBe(100);
    });

    it('should convert input.amount using fetchCurrencyRates when transaction.currency is not equal to configs.currency', async () => {
      const transaction = new Transaction({
        amount: 100,
        currency: 'USD',
      });
      const result = await service.getAmountInConfiguredCurrency({
        input: transaction,
        configs: {
          currency: 'GBP',
        } as CommissionsCalculatorConfigs,
      });
      expect(service.fetchCurrencyRates).toHaveBeenCalled();
      expect(result).toBe(25);
    });
  });

  describe('getTotalTransactionsAmountFromPastMonths', () => {
    it('should return 0 when configs.discountTurnoverMonths is less or equal to 0', async () => {
      const transactionService = module.get(TransactionsService);
      const transaction = new Transaction({
        clientId: 1,
        date: new Date('2021-01-01'),
        amount: 100,
        currency: 'EUR',
      });
      const result = await service.getTotalTransactionsAmountFromPastMonths({
        transaction,
        configs: { discountTurnoverMonths: 0 } as CommissionsCalculatorConfigs,
      });
      expect(result).toBe(0);
      expect(
        transactionService.getAmountByClientIdAndMonth,
      ).toHaveBeenCalledTimes(0);
    });

    it('should return 0 when configs.discountTurnoverMonths 1 and there are no transactions', async () => {
      const transactionService = module.get(TransactionsService);
      jest
        .spyOn(transactionService as any, 'getAmountByClientIdAndMonth')
        .mockReturnValue(0);
      const transaction = new Transaction({
        clientId: 1,
        date: new Date('2021-01-01'),
        amount: 100,
        currency: 'EUR',
      });
      const result = await service.getTotalTransactionsAmountFromPastMonths({
        transaction,
        configs: { discountTurnoverMonths: 1 } as CommissionsCalculatorConfigs,
      });
      expect(
        transactionService.getAmountByClientIdAndMonth,
      ).toHaveBeenCalledTimes(1);
      expect(result).toBe(0);
    });

    describe('should return total amount when configs.discountTurnoverMonths is greater than 0 and there are transactions', () => {
      test.each([
        {
          discountTurnoverMonths: 1,
          totalAmountPerMonth: 100,
          expected: 100,
        },
        {
          discountTurnoverMonths: 2,
          totalAmountPerMonth: 100,
          expected: 200,
        },
      ])(
        'should return $expected when configs.discountTurnoverMonths is $discountTurnoverMonths and there are transactions for 100 EUR each month',
        async ({ expected, discountTurnoverMonths, totalAmountPerMonth }) => {
          const transactionService = module.get(TransactionsService);
          jest
            .spyOn(transactionService as any, 'getAmountByClientIdAndMonth')
            .mockReturnValue(totalAmountPerMonth);
          const transaction = new Transaction({
            clientId: 1,
            date: new Date('2021-02-20'),
            amount: 100,
            currency: 'EUR',
          });
          const result = await service.getTotalTransactionsAmountFromPastMonths(
            {
              transaction,
              configs: {
                discountTurnoverMonths,
              } as CommissionsCalculatorConfigs,
            },
          );
          expect(result).toBe(expected);
          expect(
            transactionService.getAmountByClientIdAndMonth,
          ).toHaveBeenCalledTimes(discountTurnoverMonths);
          expect(
            transactionService.getAmountByClientIdAndMonth,
          ).toHaveBeenNthCalledWith(1, {
            clientId: 1,
            date: new Date('2021-02'),
          });

          if (discountTurnoverMonths === 2) {
            expect(
              transactionService.getAmountByClientIdAndMonth,
            ).toHaveBeenNthCalledWith(2, {
              clientId: 1,
              date: new Date('2021-01'),
            });
          }
        },
      );
    });
  });
});
