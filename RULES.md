# Project Rules — Flipkart Clone

Guidelines for working on this codebase. Follow these rules when adding features, fixing bugs, or refactoring.

---

## 1. General Principles

- Keep changes **scoped** — do not modify unrelated files.
- Match **existing patterns** in the surrounding code before introducing new abstractions.
- Prefer **simple, readable code** over clever one-liners or premature generalization.
- Do not commit secrets — `.env` files are gitignored; use `.env.example` for documentation only.
- Do not commit build artifacts (`client/dist/`, `node_modules/`, `.vercel/`).

---

## 2. Repository Layout

| Directory | Purpose |
|-----------|---------|
| `client/` | React frontend — all UI, routing, and client-side state |
| `server/` | Express API — routes, controllers, Prisma, services |
| `.github/workflows/` | CI/CD deploy pipelines |

**Rule:** Frontend and backend are **independent packages** with their own `package.json`, dependencies, and Vercel projects. Never merge them into a single deployable unit.

**Rule:** Do not add a root-level `package.json` unless there is a clear monorepo tooling need. Run commands from `client/` or `server/`.

---

## 3. Frontend Rules (`client/`)

### Language and Style

- Use **TypeScript** for all new frontend code (`.ts`, `.tsx`).
- Follow Prettier config in `client/.prettierrc`:
  - No semicolons
  - Double quotes
  - 2-space indent
  - Tailwind classes sorted via `prettier-plugin-tailwindcss`
- Use the `@/` path alias for imports from `src/` (e.g. `@/components/Navbar`).

### Routing

- Use **TanStack Router** file-based routes in `client/src/routes/`.
- Export routes with `createFileRoute` — do not add React Router or manual route config elsewhere.
- After adding or renaming route files, let the TanStack Router plugin regenerate `routeTree.gen.ts` (happens automatically on dev/build).
- Use `validateSearch` for typed URL search params on pages that need them.

### Data Fetching

- All HTTP calls go through **`client/src/lib/api.ts`** — components and contexts must not call `axios` directly.
- API response shapes are defined in **`client/src/lib/types.ts`**. Update types when the backend contract changes.
- Use `import.meta.env.VITE_API_URL` for the API base URL — never hardcode production URLs in source code.

### State Management

- **Cart** state lives in `CartContext`; **wishlist** state in `WishlistContext`.
- Contexts call `api.ts` functions and handle toasts/errors — pages and components consume contexts via hooks (`useCart`, `useWishlist`).
- Use **local component state** for UI-only concerns (modals, pending buttons, form inputs).
- Disable and fade action buttons while async operations are in progress (see `CartItemRow`, `WishlistImageButton`).

### Components

- **Pages** → `client/src/routes/`
- **Reusable UI** → `client/src/components/`
- **shadcn/ui primitives** → `client/src/components/ui/` — extend these rather than duplicating base styles.
- **Contexts** → `client/src/context/`
- **Utilities** → `client/src/lib/utils.ts` (e.g. `cn`, `formatPrice`)

### Styling

- Use **Tailwind CSS** utility classes — avoid inline styles except for dynamic values.
- Use semantic tokens (`bg-background`, `text-foreground`, `border-border`) for theme compatibility.
- Support **light and dark mode** — test both when changing styles.

### Notifications

- Use **Sonner** (`toast.success`, `toast.error`) for user feedback.
- Global toast duration is configured in `client/src/components/ui/sonner.tsx` — do not set per-toast duration unless there is a strong reason.

### Environment Variables

- Only `VITE_*` prefixed variables are exposed to the client bundle.
- Document new variables in `client/.env.example`.
- Remember: Vite env vars are **baked in at build time** — changing them in Vercel requires a redeploy.

---

## 4. Backend Rules (`server/`)

### Language and Style

- Use **CommonJS** (`require` / `module.exports`) — the server is `"type": "commonjs"`.
- Use **async/await** in controllers; avoid callback-style Prisma calls.

### Architecture

Follow the layered pattern already in place:

```
index.js          → app setup, middleware, route mounting
routes/*.js       → HTTP method + path → controller function
controllers/*.js  → request handling, validation, Prisma queries, response
services/*.js     → cross-cutting logic (e.g. email)
middleware/*.js   → shared Express middleware
config/*.js       → constants and shared config
prismaClient.js   → single Prisma client instance
```

**Rule:** Routes must stay thin — no business logic in route files.

**Rule:** Controllers must use `try/catch` and pass errors to `next(err)` for the centralized error handler.

**Rule:** All database access goes through **`prismaClient.js`** — do not instantiate `PrismaClient` elsewhere.

### API Design

- All REST endpoints are prefixed with **`/api/`**.
- Return JSON for all responses.
- Error responses use shape: `{ "error": "message" }`.
- Use appropriate HTTP status codes:
  - `400` — validation errors, bad input, business rule violations
  - `404` — resource not found
  - `500` — unexpected server errors (handled by `errorHandler`)

**Rule:** Validate and parse route params (e.g. `:id`) before querying the database. Return `400` for invalid IDs.

### Authentication and Users

- There is **no authentication layer**.
- All cart, wishlist, and order operations use **`DEFAULT_USER_ID`** from `server/config/constants.js` (user ID `1`, seeded as `default@flipkartclone.com`).
- Do not add user-specific logic without first implementing a real auth system.

### Prisma and Database

- Schema lives in `server/prisma/schema.prisma`.
- After schema changes:
  1. Create a migration: `npx prisma migrate dev --name <description>`
  2. Commit the migration files under `server/prisma/migrations/`
- Use **`npx prisma migrate deploy`** in production — never `migrate dev`.
- Seed data is in `server/prisma/seed.js` — keep it idempotent.
- Use transactions (`prisma.$transaction`) for multi-step writes that must succeed or fail together (e.g. order placement).

### Environment Variables

- Load env via `server/loadEnv.js` (dotenv).
- Document new variables in `server/.env.example`.
- Production on Vercel:
  - Use Neon **pooled** URL for `DATABASE_URL` at runtime
  - Use Neon **direct** URL only for running migrations locally/CI

### Email

- Order emails go through `server/services/emailService.js`.
- Email sending is **optional** — if SMTP env vars are missing, skip silently; do not throw.

### Vercel / Serverless

- `server/index.js` exports the Express app when `process.env.VERCEL` is set; uses `app.listen()` only for local dev.
- Do not add long-running background jobs or in-memory caches that assume a persistent process.

---

## 5. API Contract Rules

When changing an endpoint:

1. Update the **controller** and **route**.
2. Update **`client/src/lib/api.ts`** with the matching function.
3. Update **`client/src/lib/types.ts`** if the response shape changed.
4. Update **`server/API_ENDPOINTS.md`** with curl examples for new or changed endpoints.

Keep frontend types in sync with Prisma/API response shapes. The frontend `Product`, `CartItemDTO`, `Order`, etc. interfaces must reflect what the API actually returns.

---

## 6. Error Handling

### Backend

- Throw errors with `status` property for expected failures: `const err = new Error("..."); err.status = 400; throw err;`
- Let `server/middleware/errorHandler.js` format all error responses.
- Map Prisma `P2025` to `404` — already handled globally.

### Frontend

- Extract API error messages from `err.response.data.error` when available (see `getErrorMessage` in contexts).
- Show user-friendly fallback: `"Something went wrong. Please try again."`
- Use `toast.error()` for operation failures; `toast.success()` for confirmations.

---

## 7. Deployment Rules

### Vercel Projects

| App | Root Directory | Config |
|-----|----------------|--------|
| Frontend | `client/` | `client/vercel.json` (SPA rewrites) |
| Backend | `server/` | `server/vercel.json` (@vercel/node) |

**Rule:** Deploy frontend and backend as **separate Vercel projects**.

**Rule:** Set `CLIENT_ORIGIN` on the backend to the exact frontend production URL (no trailing slash).

**Rule:** Set `VITE_API_URL` on the frontend to the backend production URL.

### GitHub Actions

- Backend workflow triggers on changes to `server/**`.
- Frontend workflow triggers on changes to `client/**`.
- Do not combine into one workflow unless deploy coupling is intentional.

### Database Migrations

- **Never** run `prisma migrate dev` against production.
- **Never** add auto-migration steps to Vercel build — run migrations manually or via a dedicated CI step with the direct DB URL.

---

## 8. Git and Code Review

- Write clear commit messages describing **why**, not just what.
- Do not commit `.env`, `.vercel/`, or `node_modules/`.
- Run before opening a PR:
  ```bash
  # Frontend
  cd client && npm run typecheck && npm run lint

  # Backend — verify server starts and endpoints respond
  cd server && npm run dev
  ```
- Keep PRs focused — one feature or fix per PR when possible.

---

## 9. Adding New Features — Checklist

### New API endpoint

- [ ] Prisma schema updated (if needed) + migration created
- [ ] Controller function with validation and error handling
- [ ] Route registered in `routes/` and mounted in `index.js`
- [ ] `api.ts` function added on frontend
- [ ] Types added/updated in `types.ts`
- [ ] `API_ENDPOINTS.md` updated

### New frontend page

- [ ] Route file added under `client/src/routes/`
- [ ] Uses existing components and contexts where possible
- [ ] Loading and error states handled
- [ ] Works in light and dark mode
- [ ] Direct URL access works (SPA rewrite in `vercel.json` handles this)

### New environment variable

- [ ] Added to the relevant `.env.example`
- [ ] Documented in `README.md` if user-facing
- [ ] Set in Vercel project dashboard for production

---

## 10. Do Not

- Do not add user authentication without a planned migration path from `DEFAULT_USER_ID`.
- Do not store payment credentials or process real payments — checkout is simulated.
- Do not use SQLite or change the database provider without updating Prisma config and adapters.
- Do not import server code into the client or vice versa.
- Do not bypass CORS by setting `CLIENT_ORIGIN=*` in production long-term.
- Do not add comments that merely restate what the code does — comment only non-obvious business logic.
- Do not create empty abstraction layers (helpers used once, unnecessary wrappers).

---

## 11. Key Assumptions (Do Not Violate Without Discussion)

1. Single default user for all sessions (no login).
2. PostgreSQL is the only supported database.
3. Frontend and backend are deployed separately on Vercel.
4. Product stock is decremented atomically on order placement.
5. Cart items are unique per `(userId, productId, size, color)`.
6. Wishlist items are unique per `(userId, productId)`.
7. Order confirmation email is best-effort, not guaranteed delivery.

---

For setup instructions and tech stack details, see [README.md](README.md).
