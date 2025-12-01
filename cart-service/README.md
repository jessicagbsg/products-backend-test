# Cart Service

Cart microservice developed with NestJS, PostgreSQL and TypeORM.

## Description

This service provides REST endpoints to manage shopping carts. The carts are stored in a PostgreSQL database using TypeORM as ORM.

## Project structure

```
src/
  cart/
    dto/
      add-product.dto.ts           # DTOs for adding products
      remove-product.dto.ts        # DTOs for removing products
      cart-response.dto.ts         # Cart response DTO
      cart-item.dto.ts             # Cart item DTO
    entities/
      cart.entity.ts               # Cart entity
      cart-item.entity.ts          # Cart item entity
    cart.controller.ts             # Controller
    cart.service.ts                # Business rules
    cart.module.ts                 # NestJS Module
  common/
    filters/
      http-exception.filter.ts     # Global exceptions filter
  health/
    health.controller.ts           # Controller
    health.service.ts              # Business rules
    health.module.ts               # NestJS Module
  app.module.ts                    # Root module
  main.ts
```

## Configuration

Create `.env` in the root folder:

```env
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cart
NODE_ENV=development
```

## Install dependencies

```bash
npm install
```

## Running the project

### With Docker (Recommended)

From the project root:

```bash
# Build and start PostgreSQL + Cart Service
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f cart-service

# Stop services
docker-compose down
```

The service will be available at http://localhost:3002

### Local Development

```bash
# start development
npm run start:dev

# start production
npm run start:prod
```

**Note:** Make sure PostgreSQL is running locally when running without Docker.

## Tests

```bash
# run unit tests
npm test

# watch mode for tests
npm run test:watch

# test coverage
npm run test:cov
```

## Endpoints

- `GET /cart` - Get user's cart (requires `x-user-id` header)
- `POST /cart/add` - Add product to cart (requires `x-user-id` header)
- `DELETE /cart/remove/:productId` - Remove product from cart (requires `x-user-id` header)

## Cart structure

```json
{
  "shoppingCartId": "cart-uuid-1",
  "userId": "user-123",
  "totalPrice": "267.00",
  "totalQuantity": 1,
  "items": [
    {
      "productId": "192663",
      "price": "267.00",
      "quantity": 1
    }
  ]
}
```

**Note:** The `price` and `totalPrice` fields are strings to support decimal values with precision (e.g., "267.00", "150.50").
