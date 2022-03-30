import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('CommissionsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/commission (GET)', () => {
    test.each([
      {
        date: '2021-01-01',
        amount: '100.00',
        currency: 'EUR',
        client_id: 42,
        expected: '200.40',
        expectedCur: 'EUR',
      },
      {
        date: '2021-01-01',
        amount: '200.40',
        currency: 'USD',
        client_id: 42,
        expected: '10.02',
        expectedCur: 'EUR',
      },
    ])(
      'should respond with amount $expected and currency $expectedCur with date $date, amount $amount and currency $currency and client_id $client_id',
      ({ date, client_id, amount, currency, expected, expectedCur }) => {
        return request(app.getHttpServer())
          .post('/commissions')
          .send({
            date: date,
            amount: amount,
            currency: currency,
            client_id: client_id,
          })
          .expect(200)
          .expect({
            amount: expected,
            currency: expectedCur,
          });
      },
    );
  });
});
