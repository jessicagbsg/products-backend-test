# Products Backend Test

Microservices backend application with Products Service, Cart Service, and API Gateway.

## Services

- **products-service**: MongoDB + Mongoose (Port 3001)
- **cart-service**: PostgreSQL + TypeORM (Port 3002)
- **api**: API Gateway (Port 3000)

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed

### Environment Variables

Create a `.env` file in the project root (you can copy from `.env.example`):

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=cart
POSTGRES_PORT=5432

# MongoDB Configuration
MONGODB_URI=mongodb://mongodb:27017/products

# Service Ports
API_PORT=3000
PRODUCTS_SERVICE_PORT=3001
CART_SERVICE_PORT=3002

# Database Connection (for cart-service)
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cart
NODE_ENV=development

# API Gateway Configuration
PRODUCTS_SERVICE_URL=http://products-service:3001
CART_SERVICE_URL=http://cart-service:3002
JWT_SECRET=jwt-secret-key-change-in-production

# Rate Limiting Configuration (optional, defaults shown)
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# CORS Configuration (optional, defaults shown)
# For microservices (products-service, cart-service): only API Gateway
# For API Gateway: frontend origins (comma-separated)
CORS_ORIGINS=http://api-gateway:3000,http://localhost:3000
```

**Note:** All variables have default values in `docker-compose.yml`, so you can start without a `.env` file.

### Running All Services with Docker

```bash
# Build and start all services (MongoDB, PostgreSQL, Products Service, Cart Service)
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f api
docker-compose logs -f products-service
docker-compose logs -f cart-service

# Stop services
docker-compose down

# Stop and remove volumes (clears databases)
docker-compose down -v
```

The services will be available at:

- **API Gateway**: http://localhost:3000
  - API v1: http://localhost:3000/v1
  - Swagger UI: http://localhost:3000/api
- Products Service: http://localhost:3001
- Cart Service: http://localhost:3002
- MongoDB: localhost:27017
- PostgreSQL: localhost:5432

### Seed the databases

After starting the services, you can seed the database:

```bash
# Seed products database
cd products-service
npm run dev:docker:seed

```

## Local Development

### Products Service

1. Create `.env` file in `products-service/`:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/products
```

2. Make sure MongoDB is running locally

3. Install dependencies and run:

```bash
cd products-service
npm install
npm run start:dev
```

4. Seed the database:

```bash
npm run seed
```

### Cart Service

1. Create `.env` file in `cart-service/`:

```env
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cart
NODE_ENV=development
```

2. Make sure PostgreSQL is running locally

3. Install dependencies and run:

```bash
cd cart-service
npm install
npm run start:dev
```

### API Gateway

1. Create `.env` file in `api/`:

```env
PORT=3000
PRODUCTS_SERVICE_URL=http://localhost:3001
CART_SERVICE_URL=http://localhost:3002
JWT_SECRET=jwt-secret-key-change-in-production
```

2. Install dependencies and run:

```bash
cd api
npm install
npm run start:dev
```

## Project Structure

```
.
├── products-service/     # Products microservice
├── cart-service/         # Cart microservice
├── api/                  # API Gateway
└── docker-compose.yml    # Docker Compose configuration
```

## Improvements

### 1. Product Validation

- Use product stock amount and SKU to ensure users are buying existing and valid products
- Implement inventory management to prevent overselling
- Add product availability checks before adding to cart

### 2. Authentication & Authorization

- Implement a full login/logout system with password recovery
- Add refresh token mechanism to keep users logged in until manual logout or expiration
- Implement role-based access control (RBAC) for different user types
- Add multi-factor authentication (MFA) for enhanced security

### 3. User Management

- Implement a full user database to validate user existence
- Create user registration endpoint with email verification
- Add user profile management (update profile, change password)
- Implement user roles and permissions system

### 4. Anonymous Cart Migration

- Implement the ability to create a cart for anonymous users
- Migrate anonymous cart to logged-in user when authentication occurs
- Handle cart merging when user logs in with existing cart items

### 5. Service-to-Service Security

- Add API keys to microservices to secure connections between services
- Implement mutual TLS (mTLS) for service-to-service communication
- Add service authentication middleware

#### 6. Caching Strategy

- Add Redis for caching frequently accessed data
- Cache product listings and user cart data
- Implement cache invalidation strategies
- Use cache for session management

### Additional Improvements - Production Environment

#### 7. Logging & Monitoring

- Implement structured logging (e.g., Winston, Pino)
- Add distributed tracing (e.g., Jaeger, Zipkin)
- Set up application performance monitoring (APM)
- Create dashboards for service health and metrics
- Implement alerting for critical errors

#### 8. Message Queue & Event-Driven Architecture

- Implement message queue (RabbitMQ, Kafka) for async communication
- Add event-driven architecture for cart updates and order processing
- Implement event sourcing for audit trails
- Add dead letter queue for failed messages

#### 9. Testing & Quality Assurance

- Add integration tests for service communication
- Implement end-to-end (E2E) tests
- Add load testing and performance benchmarks
- Implement contract testing between services
- Add mutation testing for better coverage

#### 10. Resilience & Fault Tolerance

- Implement circuit breaker pattern (e.g., Hystrix, Resilience4j)
- Add retry mechanisms with exponential backoff
- Implement bulkhead pattern for resource isolation
- Add timeout configurations for all external calls
- Implement graceful degradation
