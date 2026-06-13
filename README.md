# Flipkart Clone

A full-stack e-commerce web application inspired by Flipkart. Browse products, manage a cart and wishlist, place orders, and view order history — with a React frontend and Express REST API backed by PostgreSQL.

## Features

- Product listing with search and category filters
- Product detail pages with size/color selection
- Shopping cart (add, update quantity, remove items)
- Wishlist
- Checkout with shipping address form
- Order history and order detail views
- Order confirmation emails (optional, via SMTP)
- Light/dark theme support
- Deployed as separate frontend and backend projects on Vercel

## Tech Stack

### Frontend (`client/`)

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Language | TypeScript |
| Build tool | Vite 8 |
| Routing | TanStack Router |
| Styling | Tailwind CSS 4 |
| UI components | shadcn/ui, Radix UI |
| HTTP client | Axios |
| Notifications | Sonner |
| Icons | Lucide React |

### Backend (`server/`)

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express 5 |
| ORM | Prisma 7 |
| Database | PostgreSQL (Neon recommended) |
| Email | Nodemailer (optional) |

### DevOps

- **Vercel** — hosting for frontend (static) and backend (serverless)
- **GitHub Actions** — automated production deploys on push to `main`
- **Neon** — managed PostgreSQL (assumed for production)

## Project Structure

```
flipkart-clone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── context/        # Cart & wishlist state
│   │   ├── lib/            # API client, types, utils
│   │   └── routes/         # TanStack Router pages
│   ├── vercel.json         # SPA rewrites
│   └── .env.example
├── server/                 # Express API
│   ├── controllers/
│   ├── routes/
│   ├── prisma/             # Schema, migrations, seed
│   ├── services/           # Email service
│   ├── vercel.json         # Serverless routing
│   └── .env.example
└── .github/workflows/      # Vercel deploy pipelines
```

## Prerequisites

- **Node.js** 20+
- **npm**
- **PostgreSQL** database (local Postgres or [Neon](https://neon.tech) cloud instance)

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd flipkart-clone
```

### 2. Backend setup

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your database URL and other settings:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Install dependencies, run migrations, and seed the database:

```bash
npm install
npx prisma migrate deploy
npx prisma db seed
```

Start the API server:

```bash
npm run dev
```

The API runs at **http://localhost:5000**.

### 3. Frontend setup

Open a new terminal:

```bash
cd client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The app runs at **http://localhost:5173** (Vite default).

### 4. Verify

- Open http://localhost:5173 — products should load from the API
- API health check: `curl http://localhost:5000/`

## Environment Variables

### Backend (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `PORT` | No | Local server port (default: `5000`) |
| `CLIENT_ORIGIN` | No | Frontend URL for CORS (default: `*`) |
| `SMTP_HOST` | No | SMTP host for order emails |
| `SMTP_PORT` | No | SMTP port |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password / app password |
| `SMTP_FROM` | No | Sender address for emails |

If SMTP variables are not set, order confirmation emails are skipped silently.

### Frontend (`client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend API base URL (default: `http://localhost:5000`) |

`VITE_*` variables are embedded at **build time**. Changing them in production requires a redeploy.

## API Endpoints

Base URL: `http://localhost:5000` (local)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (`?search=`, `?category=`) |
| GET | `/api/products/:id` | Product detail |
| GET | `/api/categories` | List categories |
| GET | `/api/cart` | Cart summary |
| POST | `/api/cart` | Add or increment cart item |
| PUT | `/api/cart/:itemId` | Update item quantity |
| DELETE | `/api/cart/:itemId` | Remove cart item |
| GET | `/api/wishlist` | Wishlist items |
| POST | `/api/wishlist` | Add to wishlist |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist |
| POST | `/api/orders` | Place order from cart |
| GET | `/api/orders` | Order history |
| GET | `/api/orders/:id` | Order detail |

See [`server/API_ENDPOINTS.md`](server/API_ENDPOINTS.md) for curl examples and test flows.

## Deployment

Frontend and backend are deployed as **separate Vercel projects** from the same repository.

### Manual deploy (Vercel CLI)

```bash
# Backend
cd server
vercel link
vercel env add DATABASE_URL production   # use Neon pooled URL
vercel env add CLIENT_ORIGIN production
vercel --prod

# Frontend
cd ../client
vercel link
vercel env add VITE_API_URL production   # backend production URL
vercel --prod
```

### GitHub Actions (CI/CD)

Workflows in `.github/workflows/` deploy on push to `main` when relevant files change:

- `deploy-backend.yml` — triggers on `server/**` changes
- `deploy-frontend.yml` — triggers on `client/**` changes

Required GitHub secrets:

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel account token |
| `VERCEL_ORG_ID` | Vercel team/org ID |
| `VERCEL_BACKEND_PROJECT_ID` | Backend project ID |
| `VERCEL_FRONTEND_PROJECT_ID` | Frontend project ID |

Obtain org/project IDs after running `vercel link` in each directory:

```bash
cat server/.vercel/project.json
cat client/.vercel/project.json
```

### Production database

Run migrations against your production database using Neon's **direct** (non-pooler) connection URL:

```bash
cd server
DATABASE_URL="postgresql://...direct..." npx prisma migrate deploy
DATABASE_URL="postgresql://...direct..." npx prisma db seed
```

Use the **pooled** connection URL as `DATABASE_URL` in the Vercel backend project settings.

## Assumptions

1. **No authentication** — The app uses a single default user (`default@flipkartclone.com`, ID `1`) for all cart, wishlist, and order operations. There is no login/signup flow.

2. **Single-user demo** — Cart and wishlist data are scoped to the seeded default user, not to individual logged-in sessions.

3. **PostgreSQL required** — The backend uses Prisma with the PostgreSQL driver adapter (`@prisma/adapter-pg`). SQLite or other databases are not supported without schema changes.

4. **Neon for production** — Production deployment assumes a Neon PostgreSQL instance with separate **direct** (migrations) and **pooled** (runtime) connection strings.

5. **Payment is simulated** — Checkout collects a shipping address and creates an order record. No real payment gateway (Razorpay, Stripe, etc.) is integrated.

6. **Stock management** — Product stock is decremented on order placement. Out-of-stock items cannot be added beyond available quantity.

7. **Email is optional** — Order confirmation emails are sent only when SMTP credentials are configured.

8. **CORS** — In production, `CLIENT_ORIGIN` on the backend must match the frontend URL exactly (no trailing slash).

9. **Separate Vercel projects** — Frontend and backend are intentionally deployed as two independent Vercel projects, not a monolithic deployment.

## Available Scripts

### Backend (`server/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with nodemon |
| `npm start` | Start API (production) |
| `npm run build` | Generate Prisma client |
| `npx prisma migrate deploy` | Apply migrations |
| `npx prisma db seed` | Seed categories, products, default user |

### Frontend (`client/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |

## License

ISC
