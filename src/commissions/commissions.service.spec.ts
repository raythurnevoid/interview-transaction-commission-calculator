import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsController } from './commissions.controller';
import { CommissionsService } from './commissions.service';
import { Transaction } from '../transactions/entities/transaction.entity';
import { CommissionsCalculatorConfigsService } from '../commissions-calculator-configs/commissions-override-rules.service';
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
    module = await Test.createTestingModule({
      imports: [],
      controllers: [CommissionsController],
      providers: [
        CommissionsService,
        {
          provide: CommissionsOverrideRulesService,
          useValue: {
            findByClientId: (): CommissionOverrideRule => {
              return undefined;
            },
          },
        },
        {
          provide: CommissionsCalculatorConfigsService,
          useValue: {
            getConfigs: (): CommissionsCalculatorConfigs => {
              return {
                minimumCommission: 0.05,
                discountCommission: 0.03,
                discountTurnoverMonths: 1,
                commissionPercentage: 0.0005,
                currency: 'EUR',
              };
            },
          },
        },
        {
          provide: TransactionsService,
          useValue: {
            getAmountByClientIdAndMonth: (): number => {
              return undefined;
            },
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
        USD: 1.136796,
      }),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculatePercentage', () => {
    it('5% of 100 is 5', () => {
      expect(service.calculatePercentage(100, 0.0005)).toBe(0.05);
    });

    it('5% of 200.4 is 10.02', () => {
      expect(service.calculatePercentage(200.4, 0.0005)).toBe(0.1);
    });
  });

  describe('getCommission', () => {
    test.each([
      {
        amount: 100,
        currency: 'EUR',
        expected: 0.05,
        date: new Date(2021, 0, 1),
        clientId: 1,
      },
      {
        amount: 90,
        currency: 'EUR',
        expected: 0.05,
        date: new Date(2021, 0, 1),
        clientId: 1,
      },
      {
        amount: 200.4,
        currency: 'EUR',
        expected: 0.1,
        date: new Date(2021, 0, 1),
        clientId: 1,
      },
      {
        amount: 200,
        currency: 'USD',
        expected: 0.08,
        date: new Date(2021, 0, 1),
        clientId: 1,
      },
    ])(
      'should return $expected when amount is $amount and currency is $currency',
      ({ expected, ...input }) => {
        expect(service.getCommission(input as Transaction)).resolves.toEqual({
          amount: expected,
          currency: 'EUR',
        });
      },
    );
  });
});
