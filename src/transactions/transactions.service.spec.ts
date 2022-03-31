/* eslint-disable @typescript-eslint/no-empty-function */
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let module: TestingModule;

  afterEach(async () => {
    await module.close();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [
        TransactionsService,
        {
          provide: getModelToken(Transaction.name),
          useValue: (() => {
            const Clazz = jest.fn(() => {
              return {
                save: Clazz.save,
                find: Clazz.find,
                aggregate: Clazz.aggregate,
              };
            });
            Clazz.aggregate = jest.fn();
            Clazz.find = jest.fn();
            Clazz.save = jest.fn();
            return Clazz;
          })(),
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAmountByClientIdAndMonth', () => {
    it('should call TransactionModel.aggregate 1 time', async () => {
      const TransactionModel = module.get(getModelToken(Transaction.name));
      const spy = jest
        .spyOn(TransactionModel, 'aggregate')
        .mockReturnValue([{ amount: 0 }]);
      const getAmountByClientIdAndMonthAggregationSpy = jest
        .spyOn(service, 'getAmountByClientIdAndMonthAggregation')
        .mockReturnValue({} as any);
      const input = {
        clientId: 1,
        date: new Date(Date.UTC(2021, 0, 1)),
      };
      const result = await service.getAmountByClientIdAndMonth(input);
      expect(getAmountByClientIdAndMonthAggregationSpy).toHaveBeenCalledTimes(
        1,
      );
      expect(getAmountByClientIdAndMonthAggregationSpy).toHaveBeenCalledWith(
        input,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({});
      expect(result).toEqual(0);
    });
  });

  describe('getAmountByClientIdAndMonthAggregation', () => {
    it('should return aggregation with given input', async () => {
      const input = {
        clientId: 1,
        date: new Date(Date.UTC(2021, 0, 1)),
      };
      const result = await service.getAmountByClientIdAndMonthAggregation(
        input,
      );
      expect(result[0].$match.clientId).toEqual(input.clientId);
      expect(result[2].$match.month).toEqual(input.date.getMonth() + 1);
    });
  });

  describe('createTransaction', () => {
    it('should call TransactionModel.save 1 time', async () => {
      const TransactionModel = module.get(getModelToken(Transaction.name));
      const spy = jest.spyOn(TransactionModel, 'save').mockReturnValue({});
      const input = new Transaction({
        clientId: 1,
        amount: 0.05,
        date: new Date(Date.UTC(2021, 0, 1)),
      });
      const result = await service.createTransaction(input);
      expect(TransactionModel).toHaveBeenCalledTimes(1);
      expect(TransactionModel).toHaveBeenCalledWith(input);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith();
      expect(result).toEqual({});
    });
  });

  describe('findAllTransactions', () => {
    it('should call TransactionModel.find 1 time', async () => {
      const TransactionModel = module.get(getModelToken(Transaction.name));
      const spy = jest.spyOn(TransactionModel, 'find').mockReturnValue({});
      const result = await service.findAllTransactions();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith();
      expect(result).toEqual({});
    });
  });

  describe('findTransactionsByClientId', () => {
    it('should call TransactionModel.find 1 time with given clientId', async () => {
      const TransactionModel = module.get(getModelToken(Transaction.name));
      const spy = jest.spyOn(TransactionModel, 'find').mockReturnValue({});
      const clientId = 1;
      const result = await service.findTransactionsByClientId(clientId);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        clientId,
      });
      expect(result).toEqual({});
    });
  });
});
