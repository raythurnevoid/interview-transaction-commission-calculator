import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { COMMISSIONS_CALCULATOR_MONGO_CONNECTION_NAME } from '../src/constants';
import { CommissionOverrideRulesModule } from '../src/commissions-override-rules/commissions-override-rules.module';
import { CommissionsModule } from '../src/commissions/commissions.module';
import { TransactionsModule } from '../src/transactions/transactions.module';
import { CommissionsCalculatorConfigsModule } from '../src/commissions-calculator-configs/commissions-calculator-configs.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('e2e', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let module: TestingModule;

  afterAll(async () => {
    module.close();
  });

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    module = await Test.createTestingModule({
      imports: [
        HttpModule,
        MongooseModule.forRoot(mongoServer.getUri(), {
          connectionName: COMMISSIONS_CALCULATOR_MONGO_CONNECTION_NAME,
        }),
        CommissionOverrideRulesModule,
        CommissionsModule,
        TransactionsModule,
        CommissionsCalculatorConfigsModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  test('configs and transactions', async () => {
    await request(app.getHttpServer())
      .post('/configs')
      .send({
        minimum_commission: '0.05',
        discount_commission: '0.03',
        discount_turnover_months: 1,
        discount_turnover_amount: '1000.00',
        commission_percentage: 0.005,
        currency: 'EUR',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/commissions-override-rules')
      .send({
        fixed_commission: '0.05',
        currency: 'EUR',
        client_id: 42,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        date: '2021-01-02',
        amount: '2000.00',
        currency: 'EUR',
        client_id: 42,
      })
      .expect(201)
      .expect({ amount: '0.05', currency: 'EUR' });

    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        date: '2021-01-03',
        amount: '500.00',
        currency: 'EUR',
        client_id: 1,
      })
      .expect(201)
      .expect({ amount: '2.50', currency: 'EUR' });

    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        date: '2021-01-04',
        amount: '499.00',
        currency: 'EUR',
        client_id: 1,
      })
      .expect(201)
      .expect({ amount: '2.50', currency: 'EUR' });

    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        date: '2021-01-05',
        amount: '100.00',
        currency: 'EUR',
        client_id: 1,
      })
      .expect(201)
      .expect({ amount: '0.50', currency: 'EUR' });

    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        date: '2021-01-05',
        amount: '1.00',
        currency: 'EUR',
        client_id: 1,
      })
      .expect(201)
      .expect({ amount: '0.03', currency: 'EUR' });
    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        date: '2021-01-06',
        amount: '1000.00',
        currency: 'EUR',
        client_id: 42,
      })
      .expect(201)
      .expect({ amount: '0.03', currency: 'EUR' });

    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        date: '2021-02-01',
        amount: '500.00',
        currency: 'EUR',
        client_id: 1,
      })
      .expect(201)
      .expect({ amount: '2.50', currency: 'EUR' });
  });

  test('currency conversion', () => {
    return request(app.getHttpServer())
      .post('/commission')
      .send({
        date: '2021-01-01',
        amount: '200.00',
        currency: 'USD',
        client_id: 1,
      })
      .expect(200)
      .expect({ amount: '0.82', currency: 'EUR' });
  });
});
