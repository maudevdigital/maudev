# MauDev — Sales Platform

## Project Overview

Full-stack sales platform for a Chilean startup selling TradingView Pine Script extensions and digital services. Built in Spanish for the Chilean market.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (api-server)
- **Frontend**: React + Vite (maudev artifact)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Clerk
- **Payments**: Flow (Chilean gateway)
- **Validation**: Zod (zod/v4), drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

- `artifacts/api-server` — Express 5 REST API, port 8080
- `artifacts/maudev` — React + Vite frontend, port 20866, route `/`

## Database Schema

- `products` — Pine Script extensions and digital services
- `orders` — purchases with Flow payment integration
- `email_subscribers` — newsletter subscribers

## Key Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection URL |
| `SESSION_SECRET` | Express session secret |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk public key (frontend) |
| `CLERK_SECRET_KEY` | Clerk secret key (backend) |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook verification |
| `FLOW_API_KEY` | Flow payment API key (required for payments) |
| `FLOW_SECRET_KEY` | Flow payment secret key (required for payments) |
| `FLOW_SANDBOX` | `"true"` for sandbox, `"false"` for production |
| `ADMIN_EMAILS` | Comma-separated list of admin email addresses |

## Pages

- `/` — Landing page (hero, featured products, features, newsletter)
- `/products` — Product catalog with filters and search
- `/products/:id` — Product detail with buy button
- `/checkout` — Checkout page (redirects to Flow)
- `/dashboard` — User orders dashboard
- `/sign-in`, `/sign-up` — Clerk auth pages
- `/admin` — Admin dashboard (stats, recent orders)
- `/admin/products` — Product CRUD management
- `/admin/orders` — All orders with statuses
- `/admin/subscribers` — Newsletter subscribers list

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## API Routes (api-server)

- `GET /api/products` — list products (filter by category)
- `GET /api/products/featured` — featured products
- `GET /api/products/:id` — single product
- `POST /api/products` — create product (admin)
- `PUT /api/products/:id` — update product (admin)
- `DELETE /api/products/:id` — delete product (admin)
- `GET /api/orders` — user's orders (auth required)
- `POST /api/orders` — create order + Flow payment
- `GET /api/orders/all` — all orders (admin)
- `GET /api/payments/confirm` — Flow payment confirmation redirect
- `POST /api/payments/webhook` — Flow webhook
- `POST /api/email/subscribe` — subscribe to newsletter
- `GET /api/admin/stats` — dashboard stats (admin)
- `GET /api/admin/subscribers` — subscriber list (admin)

## Design System

- Dark theme with electric blue primary (`#00bfff` range)
- Fonts: Space Mono (headings/labels) + Plus Jakarta Sans (body)
- Sharp corners, terminal aesthetic
- No emojis anywhere
- All UI copy in Spanish
