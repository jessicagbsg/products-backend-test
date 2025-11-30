# Products Service

Products microservice developed with NestJs, MongoDB and Mongoose.

## Description

This service provides REST endpoints to manage products. The products are stores in a MongoDB and it uses Mongoose as ODM.

## Project structure

```
src/
  products/
    dto/
      product.dto.ts           # product DTOs
    schemas/
      product.schema.ts        # Mongoose Schema
    products.controller.ts     # Controller
    products.service.ts        # Business rules
    products.module.ts         # NestJS Module
  health/
    health.controller.ts     # Controller
    health.service.ts        # Business rules
    health.module.ts         # NestJS Module
  common/
    filters/
      http-exception.filter.ts # global exceptions filter
  app.module.ts                # root module
  main.ts
```

## Configuration

create `.env` in the root folder:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/products
```

## Install dependencies

```bash
npm install
```

## Running the project

### With Docker (Recommended)

From the project root:

```bash
# Build and start MongoDB + Products Service
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f products-service

# Stop services
docker-compose down
```

The service will be available at http://localhost:3001

### Local Development

```bash
# start development
npm run dev

# start production
npm run start:prod
```

**Note:** Make sure MongoDB is running locally when running without Docker.

## Tests

```bash
# run unit tests
npm test

# watch mode for tests
npm run test:watch

# test coverage
npm run test:cov
```

## Seed Database

Populate the database with sample products:

### With Docker

```bash
# From project root
docker-compose exec products-service npm run seed:prod
```

### Local Development

```bash
npm run seed
```

This will create 100 sample products if they don't already exist.

## Endpoints

- `GET /products` - list all products

## Product structure

```json
{
  "productId": "192663",
  "price": "267.00"
}
```

**Note:** The `price` field is a string to support decimal values with precision (e.g., "267.00", "150.50").
