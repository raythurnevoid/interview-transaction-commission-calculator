/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsOverrideRulesService } from './commissions-override-rules.service';
import { CommissionOverrideRule } from './entities/commissions-override-rule.entity';

describe('CommissionOverrideRulesService', () => {
  let service: CommissionsOverrideRulesService;
  let module: TestingModule;

  afterEach(async () => {
    await module.close();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [
        CommissionsOverrideRulesService,
        {
          provide: getModelToken(CommissionOverrideRule.name),
          useValue: {
            findOneAndUpdate: jest.fn(),
            findOneAndRemove: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommissionsOverrideRulesService>(
      CommissionsOverrideRulesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCommissionOverrideRule', () => {
    it('should call CommissionOverrideRule.findOneAndUpdate 1 time', async () => {
      const CommissionOverrideRuleModel = module.get(
        getModelToken(CommissionOverrideRule.name),
      );
      const spy = jest
        .spyOn(CommissionOverrideRuleModel, 'findOneAndUpdate')
        .mockReturnValue({});
      const input = new CommissionOverrideRule({
        clientId: 1,
        currency: 'USD',
        fixedCommission: 0.05,
      });
      const result = await service.createCommissionOverrideRule(input);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        {
          clientId: input.clientId,
        },
        input,
        {
          new: true,
          upsert: true,
        },
      );
      expect(result).toEqual({});
    });
  });

  describe('deleteCommissionOverrideRule', () => {
    it('should call CommissionOverrideRule.findOneAndRemove 1 time', async () => {
      const CommissionOverrideRuleModel = module.get(
        getModelToken(CommissionOverrideRule.name),
      );
      const spy = jest.spyOn(CommissionOverrideRuleModel, 'findOneAndRemove');
      const input = new CommissionOverrideRule({
        clientId: 1,
        currency: 'USD',
        fixedCommission: 0.05,
      });
      await service.deleteCommissionOverrideRule(input);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        clientId: input.clientId,
      });
    });
  });

  describe('findAllCommissionOverrideRules', () => {
    it('should call CommissionOverrideRule.findAllCommissionOverrideRules 1 time', async () => {
      const CommissionOverrideRuleModel = module.get(
        getModelToken(CommissionOverrideRule.name),
      );
      const spy = jest
        .spyOn(CommissionOverrideRuleModel, 'find')
        .mockReturnValue({});
      const result = await service.findAllCommissionOverrideRules();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith();
      expect(result).toEqual({});
    });
  });

  describe('findCommissionOverrideRuleByClientId', () => {
    it('should call CommissionOverrideRule.findOne 1 time', async () => {
      const CommissionOverrideRuleModel = module.get(
        getModelToken(CommissionOverrideRule.name),
      );
      const spy = jest
        .spyOn(CommissionOverrideRuleModel, 'findOne')
        .mockReturnValue({});
      const clientId = 1;
      const result = await service.findCommissionOverrideRuleByClientId(
        clientId,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        clientId,
      });
      expect(result).toEqual({});
    });
  });
});
