import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsCalculatorConfigsController } from './commissions-calculator-configs.controller';
import { CommissionsCalculatorConfigsService } from './commissions-calculator-configs.service';

describe('CommissionOverrideRulesController', () => {
  let controller: CommissionsCalculatorConfigsController;
  let module: TestingModule;

  afterEach(async () => {
    await module.close();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
      controllers: [CommissionsCalculatorConfigsController],
      providers: [
        {
          provide: CommissionsCalculatorConfigsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CommissionsCalculatorConfigsController>(
      CommissionsCalculatorConfigsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('setConfigs', () => {
    it('should be defined', () => {
      expect(controller.setConfigs).toBeDefined();
    });
  });

  describe('getConfigs', () => {
    it('should be defined', () => {
      expect(controller.getConfigs).toBeDefined();
    });
  });
});
