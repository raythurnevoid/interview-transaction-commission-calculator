import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CommissionOverrideRule } from './entities/commissions-override-rule.entity';
import { CommissionOverrideRuleSchema } from './schemas/commissions-override-rule.schema';
import { CommissionOverrideRulesController } from './commissions-override-rules.controller';
import { CommissionsOverrideRulesService } from './commissions-override-rules.service';

describe('CommissionOverrideRulesController', () => {
  let controller: CommissionOverrideRulesController;
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
            name: CommissionOverrideRule.name,
            schema: CommissionOverrideRuleSchema,
          },
        ]),
      ],
      controllers: [CommissionOverrideRulesController],
      providers: [CommissionsOverrideRulesService],
    }).compile();

    controller = module.get<CommissionOverrideRulesController>(
      CommissionOverrideRulesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
