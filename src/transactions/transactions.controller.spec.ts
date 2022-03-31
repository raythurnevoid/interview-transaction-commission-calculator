import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsService } from '../commissions/commissions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import * as transactionsTransformers from './transactions.transformers';
import * as commissionsTransformers from '../commissions/commissions.transformers';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let module: TestingModule;

  jest
    .spyOn(transactionsTransformers, 'fromTransactionDtoToTransactionEntity')
    .mockImplementation(jest.fn().mockReturnValue({}));
  jest
    .spyOn(transactionsTransformers, 'fromTransactionEntityToTransactionDto')
    .mockImplementation(jest.fn().mockReturnValue({}));
  jest
    .spyOn(
      commissionsTransformers,
      'fromCommissionEntityToCommissionResponseDto',
    )
    .mockImplementation(jest.fn().mockReturnValue({}));

  afterEach(async () => {
    await module.close();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            createTransaction: jest.fn().mockReturnValue({}),
            findTransactionsByClientId: jest.fn().mockReturnValue([{}]),
            findAllTransactions: jest.fn().mockReturnValue([{}]),
          },
        },
        {
          provide: CommissionsService,
          useValue: {
            getCommission: jest.fn().mockReturnValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    test('call executions', async () => {
      const transactionsService = module.get(TransactionsService);
      const commissionsService = module.get(CommissionsService);

      await controller.createTransaction({} as any);
      expect(
        transactionsTransformers.fromTransactionDtoToTransactionEntity,
      ).toHaveBeenCalledTimes(1);
      expect(transactionsService.createTransaction).toHaveBeenCalledTimes(1);
      expect(commissionsService.getCommission).toHaveBeenCalledTimes(1);
      expect(
        commissionsTransformers.fromCommissionEntityToCommissionResponseDto,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('findTransactions', () => {
    it('should call TransactionsService.findTransactionsByClientId when client_id is provided', () => {
      const transactionsService = module.get(TransactionsService);
      const clientId = '1';
      controller.findTransactions(clientId);
      expect(
        transactionsService.findTransactionsByClientId,
      ).toHaveBeenCalledTimes(1);
      expect(
        transactionsService.findTransactionsByClientId,
      ).toHaveBeenCalledWith(+clientId);
      expect(transactionsService.findAllTransactions).toHaveBeenCalledTimes(0);
    });

    it('should call TransactionsService.findAllTransactions when client_id is not provided', () => {
      const transactionsService = module.get(TransactionsService);
      controller.findTransactions();
      expect(
        transactionsService.findTransactionsByClientId,
      ).toHaveBeenCalledTimes(0);
      expect(transactionsService.findAllTransactions).toHaveBeenCalledTimes(1);
    });
  });
});
