import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Transaction } from './entities/transaction.entity';
import { TransactionSchema } from './schemas/transaction.schema';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let mongod: MongoMemoryServer;
  let module: TestingModule;

  afterEach(async () => {
    await module.close();
    await mongod.stop();
  });

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri()),
        MongooseModule.forFeature([
          {
            name: Transaction.name,
            schema: TransactionSchema,
          },
        ]),
      ],
      providers: [TransactionsService],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
