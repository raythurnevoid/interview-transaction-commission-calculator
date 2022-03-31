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
