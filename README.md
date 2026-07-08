# BrickHub

A LEGO sets & minifigures storefront built with React + Vite on the frontend
and an Express API backed by Supabase (Postgres) on the backend.

## Tech stack

- **Frontend**: React 19, React Router 7, Vite, Tailwind CSS
- **Backend**: Express 5, `@supabase/supabase-js`, Resend (email), Rebrickable API (catalog search)
- **Database**: Supabase (Postgres)

## Architecture

- **Frontend** (`src/`) — React + Vite SPA. Product cards, cart, and checkout
  form talk to the Express API; catalog search talks to it too, which proxies
  out to Rebrickable so the API key never reaches the browser.
- **Backend** (`server/index.js`) — Express API that:
  - serves the product catalog and single-product lookups from Supabase
    (`/api/products`, `/api/products/:id`),
  - proxies search/lookup requests to the [Rebrickable](https://rebrickable.com/api/)
    API for the full real-world LEGO catalog (`/api/search`, `/api/set/:setNum`,
    `/api/minifig/:figNum`),
  - saves sourcing requests and orders to Supabase, and sends confirmation/
    notification emails via Resend (`/api/request`, `/api/orders`, `/api/contact`),
  - exposes a password-protected admin API for managing products, orders, and
    sourcing requests (`/api/admin/*`, see [Admin panel](#admin-panel)),
  - rate-limits form, search, and admin endpoints to curb abuse.
- **Database** (Supabase / Postgres, see `scripts/schema.sql`) — three tables
  (`products`, `orders`, `sourcing_request`) plus a `decrement_stock` Postgres
  function.

Supabase credentials (`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`) are read
**only** on the backend (`server/index.js`, `scripts/seed.js`). The frontend
never sees them — it only ever talks to the Express API over `VITE_API_URL`.

### Stock is decremented atomically, not read-then-write

Naively checking `stock > 0` in application code and then writing
`stock - qty` back is a race condition: two concurrent checkouts for the last
unit can both pass the check before either write lands, overselling the item.

Instead, `decrement_stock(product_id, qty)` is a `plpgsql` function that runs
entirely inside Postgres:

```sql
select stock into current_stock
from public.products
where id = product_id
for update;                -- locks the row for the duration of the transaction

if current_stock is null or current_stock < qty then
  return false;             -- not enough stock — caller turns this into a 409
end if;

update public.products
set stock = stock - qty
where id = product_id;

return true;
```

The `for update` row lock means concurrent orders for the same product
serialize on that row instead of racing each other. `server/index.js`'s
`/api/orders` route calls this once per cart item, via `supabase.rpc(...)`,
*before* the order is inserted — if any item comes back `false` (or errors),
the whole request fails with a `409` and no order row is written, so stock
levels and saved orders never drift apart.

## Routes

### Frontend (React Router)

| Path | Page | Notes |
|---|---|---|
| `/` | Home | Hero, popular sets, philosophy, subscribe |
| `/sets` | Sets | Browse/search/filter the Supabase product catalog (type=set) |
| `/sets/:id` | Set details | Buy/add to cart, by product UUID |
| `/minifigures` | Minifigures | Browse/search/filter the catalog (type=minifig) |
| `/cart` | Cart | |
| `/checkout` | Checkout | Places a real order, decrements stock |
| `/catalog/search` | Catalog search | Search the full Rebrickable catalog |
| `/catalog/results` | Catalog results | |
| `/catalog/set/:setNum` | Rebrickable set details | |
| `/catalog/minifig/:figNum` | Rebrickable minifig details | |
| `/catalog/request` | Source a set/minifig | Saves a sourcing request + sends email |
| `/about`, `/contact` | Static pages | |
| `/admin` | Admin panel | Password-protected, **not linked in the nav** — see below |

### Backend (Express)

| Method & path | Auth | Purpose |
|---|---|---|
| `GET /api/products?type=set\|minifig` | none | List products |
| `GET /api/products/:id` | none | Single product |
| `POST /api/orders` | none | Place an order (decrements stock, sends emails) |
| `POST /api/request` | none | Submit a sourcing request (sends emails) |
| `POST /api/contact` | none | Contact form (sends email) |
| `GET /api/search`, `/api/set/:setNum`, `/api/minifig/:figNum` | none | Rebrickable catalog proxy |
| `GET /api/admin/products` | `x-admin-password` | List all products |
| `PATCH /api/admin/products/:id` | `x-admin-password` | Update a product's `price` and/or `stock` |
| `GET /api/admin/orders` | `x-admin-password` | List all orders, newest first |
| `GET /api/admin/requests` | `x-admin-password` | List all sourcing requests, newest first |

## Admin panel

A minimal, password-protected panel for day-to-day store management — no
separate user accounts, just a single shared password.

- **Access**: navigate to `/admin` directly (it's intentionally not linked
  anywhere in the nav). Enter the password from `ADMIN_PASSWORD` in `.env`.
- **Auth model**: every `/api/admin/*` route checks the `x-admin-password`
  request header against `ADMIN_PASSWORD` server-side and returns `401` on a
  mismatch. The frontend keeps the password only in React component state
  (never `localStorage`) — refreshing the page logs you out, and any `401`
  response clears the stored password and drops you back to the login form.
- **What you can do**:
  - **Products** — see every product with editable price/stock fields and a
    per-row Save button.
  - **Orders** — read-only table of every order (customer, email, total,
    status, date), newest first.
  - **Sourcing requests** — read-only table of every request (customer,
    email, item, type, budget, status, date), newest first.
- **Limitations**: single shared password (no per-admin accounts or roles),
  no audit log of who changed what, and order/request `status` isn't
  editable from the UI yet (update it directly in the Supabase table editor
  for now).

## Project structure

```
server/index.js          Express API (products, orders, requests, admin, contact)
scripts/
  schema.sql              Idempotent SQL: tables + decrement_stock function
  seed.js                 Seeds the products table from src/data fixtures
src/
  main.jsx, App.jsx       Entry point and route definitions
  config.js               API_URL (reads VITE_API_URL)
  imageMap.js             Maps product image_key -> bundled image, per type
  context/CartContext.jsx Cart state, persisted to localStorage
  data/sets.js,
  data/minifigures.js     Fixture data used only by scripts/seed.js
  components/             Navbar, Footer, product cards, homepage sections
  pages/                  One file per route (see Routes table above)
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your own keys:
   ```bash
   cp .env.example .env
   ```

   | Variable | Required for | Where to get it |
   |---|---|---|
   | `REBRICKABLE_API_KEY` | Catalog search | rebrickable.com account settings |
   | `RESEND_API_KEY` | Sending order/contact emails | resend.com dashboard |
   | `OWNER_EMAIL` | Where order/contact notifications go | your own email |
   | `SUPABASE_URL` | Product catalog, orders & sourcing requests | Supabase project settings > API |
   | `SUPABASE_SERVICE_ROLE_KEY` | Product catalog, orders & sourcing requests | Supabase project settings > API |
   | `ADMIN_PASSWORD` | Using `/admin` and `/api/admin/*` | pick your own — keep it secret |
   | `VITE_API_URL` | Frontend knowing where the API lives | `http://localhost:3001` locally |
   | `ALLOWED_ORIGIN` | Restricting backend CORS in production | your deployed frontend origin |

   **Never commit `.env`.** It's already in `.gitignore` — keep it that way.
   If a key (or the admin password) ever leaks, rotate it immediately.

3. Set up the database: run `scripts/schema.sql` in the Supabase SQL Editor
   (Dashboard > SQL Editor > New query), then seed it:
   ```bash
   node scripts/seed.js
   ```

4. Run the backend and frontend in two terminals:
   ```bash
   npm run server   # starts Express on http://localhost:3001
   npm run dev      # starts Vite on http://localhost:5173
   ```

5. (Optional) Visit `http://localhost:5173/admin` and log in with
   `ADMIN_PASSWORD` to manage products, orders, and sourcing requests.

## Known limitations

- Checkout is a **demo** — no real payment processor is wired up yet
  (Stripe would be the natural next step).
- If `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` aren't set, the product
  catalog, orders, and sourcing requests will fail with a clear error
  instead of crashing the server — set those two values to enable them.
- The admin panel (`/admin`) uses a single shared password with no per-user
  accounts, roles, or audit trail — fine for one owner, not for a team.
- Order and sourcing-request `status` fields aren't editable from the admin
  UI yet — update them directly in the Supabase table editor for now.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run server` — start the Express API
- `npm run build` — production build of the frontend
- `npm run lint` — run ESLint
- `node scripts/seed.js` — seed the Supabase `products` table from
  `src/data/sets.js` / `src/data/minifigures.js`
