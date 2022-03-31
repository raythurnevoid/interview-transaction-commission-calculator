import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsController } from './commissions.controller';
import { CommissionsService } from './commissions.service';

describe('CommissionsController', () => {
  let controller: CommissionsController;
  let module: TestingModule;

  afterEach(async () => {
    await module.close();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
      controllers: [CommissionsController],
      providers: [
        {
          provide: CommissionsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CommissionsController>(CommissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCommission', () => {
    it('should be defined', () => {
      expect(controller.getCommission).toBeDefined();
    });
  });
});
