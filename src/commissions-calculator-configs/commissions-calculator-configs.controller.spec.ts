import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CommissionsCalculatorConfigs } from './entities/commissions-calculator-configs.entity';
import { CommissionsCalculatorConfigsSchema } from './schemas/commissions-calculator-configs.schema';
import { CommissionsCalculatorConfigsController } from './commissions-calculator-configs.controller';
import { CommissionsCalculatorConfigsService } from './commissions-override-rules.service';

describe('CommissionOverrideRulesController', () => {
  let controller: CommissionsCalculatorConfigsController;
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
      controllers: [CommissionsCalculatorConfigsController],
      providers: [CommissionsCalculatorConfigsService],
    }).compile();

    controller = module.get<CommissionsCalculatorConfigsController>(
      CommissionsCalculatorConfigsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
