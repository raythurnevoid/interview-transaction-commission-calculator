import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsService } from '../commissions/commissions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let module: TestingModule;

  afterEach(async () => {
    await module.close();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
      controllers: [TransactionsController],
      providers: [
        { provide: TransactionsService, useValue: {} },
        { provide: CommissionsService, useValue: {} },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
