## Installation

```bash
npm install
```

## Running the app

```bash
docker-compose up -d --build
```

On first start run:

```bash
docker-compose exec mongo /docker-entrypoint-initdb.d/init-db.sh update
```

To dump db:

```bash
docker-compose exec mongo bash -c "mongodump --db=commission-calculator --gzip --out=/db-dump"
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## API

### POST commission

Calculate commission

```bash
curl -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "date": "2021-01-01",
  "amount": "200.00",
  "currency": "USD",
  "client_id": 1
}' \
 'http://localhost:3000/commission'
```

### POST commissions-override-rules

Set rule to force fixed commission on some `client_id`

```bash
curl -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "fixed_commission": "0.05",
  "currency": "EUR",
  "client_id": 42
}' \
 'http://localhost:3000/commissions-override-rules'
```

### GET commissions-override-rules

Get rule by `client_id`

```bash
curl -i -X GET \
 'http://localhost:3000/commissions-override-rules?client_id=42'
```

### POST transactions

Create a transaction

```bash
curl -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "date": "2021-01-01",
  "amount": "100.00",
  "currency": "EUR",
  "client_id": 42
}' \
 'http://localhost:3000/transactions'
```

### GET transactions

Get transactions by `client_id`.

When `client_id` is not provided it will return all transactions.

```bash
curl -i -X GET \
 'http://localhost:3000/transactions?client_id=42'
```

### POST configs

Set application configurations.

```bash
curl -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "minimum_commission": "0.05",
  "discount_commission": "0.03",
  "discount_turnover_months": 1,
  "discount_turnover_amount": "1000.00",
  "commission_percentage": 0.005,
  "currency": "EUR"
}' \
 'http://localhost:3000/configs'
```

### Get configs

Get application configurations.

```bash
curl -i -X GET \
 'http://localhost:3000/configs'
```
