import { Test, TestingModule } from '@nestjs/testing';
import { CommissionOverrideRulesController } from './commissions-override-rules.controller';
import { CommissionsOverrideRulesService } from './commissions-override-rules.service';

describe('CommissionOverrideRulesController', () => {
  let controller: CommissionOverrideRulesController;
  let module: TestingModule;

  afterEach(async () => {
    await module.close();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
      controllers: [CommissionOverrideRulesController],
      providers: [
        {
          provide: CommissionsOverrideRulesService,
          useValue: {
            findCommissionOverrideRuleByClientId: jest.fn().mockReturnValue({}),
            findAllCommissionOverrideRules: jest.fn().mockReturnValue([{}]),
          },
        },
      ],
    }).compile();

    controller = module.get<CommissionOverrideRulesController>(
      CommissionOverrideRulesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deleteCommissionsOverrideRule', () => {
    it('should be defined', () => {
      expect(controller.deleteCommissionsOverrideRule).toBeDefined();
    });
  });

  describe('setCommissionsOverrideRule', () => {
    it('should be defined', () => {
      expect(controller.setCommissionsOverrideRule).toBeDefined();
    });
  });

  describe('findCommissionsOverrideRule', () => {
    it('should call CommissionOverrideRulesService.findCommissionOverrideRuleByClientId when client_id is provided', () => {
      const commissionOverrideRulesService = module.get(
        CommissionsOverrideRulesService,
      );
      const clientId = '123';
      controller.findCommissionsOverrideRule(clientId);
      expect(
        commissionOverrideRulesService.findCommissionOverrideRuleByClientId,
      ).toHaveBeenCalledTimes(1);
      expect(
        commissionOverrideRulesService.findCommissionOverrideRuleByClientId,
      ).toHaveBeenCalledWith(+clientId);
      expect(
        commissionOverrideRulesService.findAllCommissionOverrideRules,
      ).toHaveBeenCalledTimes(0);
    });

    it('should call CommissionOverrideRulesService.findAllCommissionOverrideRules when client_id is not provided', () => {
      const commissionOverrideRulesService = module.get(
        CommissionsOverrideRulesService,
      );
      controller.findCommissionsOverrideRule();
      expect(
        commissionOverrideRulesService.findCommissionOverrideRuleByClientId,
      ).toHaveBeenCalledTimes(0);
      expect(
        commissionOverrideRulesService.findAllCommissionOverrideRules,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
