Ecommerce for Spices - Backend (Express + PostgreSQL)

This backend implements APIs required by the frontend in Client/. It uses Express and PostgreSQL with a simple SQL migration system.

Contents
- Setup
- Environment
- Database migration & seed
- Run
- API overview

Setup
1) Install Node.js 18+.
2) Create a PostgreSQL database (e.g., spices).
3) Copy .env.example to .env and edit values.

Environment
PORT=5000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/spices
JWT_SECRET=use_a_strong_random_secret
CORS_ORIGIN=http://localhost:5173

Install dependencies
- From the Server folder run:
  npm install

Database migration & seed
- Apply migrations:
  npm run migrate
- Seed initial data:
  npm run seed
- Roll back last migration:
  npm run rollback

Run
- Development with auto-restart:
  npm run dev
- Production:
  npm start

API overview
Auth
POST /api/auth/register {email, password, full_name, role?}
POST /api/auth/login {email, password}
GET /api/auth/me (Bearer token)

Products
GET /api/products?category=&q=
GET /api/products/:id
POST /api/products (admin)
PUT /api/products/:id (admin)
DELETE /api/products/:id (admin)

Cart (requires auth)
GET /api/cart
POST /api/cart {product_id, quantity}
DELETE /api/cart/:productId
DELETE /api/cart

Orders
POST /api/orders/checkout {shipping_address, payment_ref?}
GET /api/orders/me
GET /api/orders/:orderId
GET /api/orders (admin)
PATCH /api/orders/:orderId/status {status}

Messages
POST /api/messages {receiver_id, content}
GET /api/messages/conversation/:otherUserId
GET /api/messages (admin)

Analytics (admin)
GET /api/analytics/summary
GET /api/analytics/sales-by-day

Notes
- All responses are JSON. Use Authorization: Bearer <token> for protected routes.
- Prices are stored as price_cents to avoid floating point errors.
- The checkout endpoint marks orders as paid and decrements stock; integrate your payment provider by validating payment_ref before creating the order if needed.
