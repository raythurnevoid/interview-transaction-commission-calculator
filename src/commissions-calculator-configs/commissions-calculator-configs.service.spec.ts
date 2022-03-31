import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsCalculatorConfigsService } from './commissions-calculator-configs.service';
import { CommissionsCalculatorConfigs } from './entities/commissions-calculator-configs.entity';

describe('CommissionOverrideRulesService', () => {
  let service: CommissionsCalculatorConfigsService;
  let module: TestingModule;

  afterEach(async () => {
    await module.close();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [
        CommissionsCalculatorConfigsService,
        {
          provide: getModelToken(CommissionsCalculatorConfigs.name),
          useValue: {
            findOneAndUpdate: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommissionsCalculatorConfigsService>(
      CommissionsCalculatorConfigsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setConfigs', () => {
    it('should call CommissionsCalculatorConfigsModel.findOneAndUpdate', async () => {
      const CommissionsCalculatorConfigsModel = module.get(
        getModelToken(CommissionsCalculatorConfigs.name),
      );
      const spy = jest.spyOn(
        CommissionsCalculatorConfigsModel,
        'findOneAndUpdate',
      );
      const input = new CommissionsCalculatorConfigs({
        commissionPercentage: 0.0005,
        currency: 'USD',
        discountCommission: 0.05,
        discountTurnoverMonths: 1,
        minimumCommission: 0.03,
      });
      await service.setConfigs(input);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({}, input, {
        new: true,
        upsert: true,
      });
    });
  });

  describe('getConfigs', () => {
    it('should call CommissionsCalculatorConfigsModel.findOne', async () => {
      const CommissionsCalculatorConfigsModel = module.get(
        getModelToken(CommissionsCalculatorConfigs.name),
      );
      const spy = jest
        .spyOn(CommissionsCalculatorConfigsModel, 'findOne')
        .mockReturnValue({});
      const result = await service.getConfigs();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith();
      expect(result).toEqual({});
    });
  });
});
