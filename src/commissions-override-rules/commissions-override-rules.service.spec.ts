import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsOverrideRulesService } from './commissions-override-rules.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CommissionOverrideRule } from './entities/commissions-override-rule.entity';
import { CommissionOverrideRuleSchema } from './schemas/commissions-override-rule.schema';

describe('CommissionOverrideRulesService', () => {
  let service: CommissionsOverrideRulesService;
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
      providers: [CommissionsOverrideRulesService],
    }).compile();

    service = module.get<CommissionsOverrideRulesService>(
      CommissionsOverrideRulesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
