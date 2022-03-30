import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsCalculatorConfigsService } from './commissions-override-rules.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CommissionsCalculatorConfigs } from './entities/commissions-calculator-configs.entity';
import { CommissionsCalculatorConfigsSchema } from './schemas/commissions-calculator-configs.schema';

describe('CommissionOverrideRulesService', () => {
  let service: CommissionsCalculatorConfigsService;
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
            name: CommissionsCalculatorConfigs.name,
            schema: CommissionsCalculatorConfigsSchema,
          },
        ]),
      ],
      providers: [CommissionsCalculatorConfigsService],
    }).compile();

    service = module.get<CommissionsCalculatorConfigsService>(
      CommissionsCalculatorConfigsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
