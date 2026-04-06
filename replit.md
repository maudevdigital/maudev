# MauDev — Sales Platform

## Project Overview

Full-stack e-commerce platform for a Chilean startup selling TradingView Pine Script indicators, MT5/MQL5 tools, and digital services. Built in Spanish for the Chilean market (maudev.cl, Santiago).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (api-server)
- **Frontend**: React + Vite (maudev artifact)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Clerk
- **Payments**: Stripe Checkout Sessions (via Replit Stripe integration)
- **Email**: Resend (via Replit Resend integration) — welcome emails, campaigns, unsubscribe
- **Validation**: Zod (zod/v4), drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild

## Artifacts

- `artifacts/api-server` — Express 5 REST API, port 8080
- `artifacts/maudev` — React + Vite frontend, port 20866, route `/`

## Database Schema

- `products` — Pine Script indicators, MT5 tools, digital services
- `orders` — purchases with Stripe Checkout Session IDs (`stripeSessionId`, `stripePaymentUrl`)
- `email_subscribers` — newsletter subscribers (`status`: active/unsubscribed, `unsubscribeToken`)

## Key Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection URL |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk public key (frontend) |
| `CLERK_SECRET_KEY` | Clerk secret key (backend) |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook verification |
| `ADMIN_EMAILS` | Comma-separated list of admin email addresses |
| `STRIPE_WEBHOOK_SECRET` | Optional: Stripe webhook signing secret for verification |
| `BASE_URL_PUBLIC` | Public app URL for Stripe redirect URLs (default: REPLIT_DOMAINS) |

> Stripe and Resend credentials are managed via Replit integrations (no env vars needed).

## Payment Flow (Stripe)

1. User clicks "Comprar" → `POST /api/orders` creates order + Stripe Checkout Session
2. Frontend redirects user to `session.url` (Stripe-hosted checkout)
3. User pays → Stripe redirects to `/dashboard?payment=success&orderId=X`
4. Dashboard calls `GET /api/orders/:id/verify` → fetches session from Stripe API → marks order paid
5. Stripe webhook `POST /api/stripe/webhook` (backup) also updates order status

## Email Flow (Resend)

- On subscribe: generate unsubscribeToken, save to DB, send welcome HTML email
- `GET /api/email/unsubscribe?token=` → mark subscriber as unsubscribed
- Admin campaign: `POST /admin/email/campaign` → send to all active subscribers in batches of 100

## Pages

- `/` — Landing page (hero with live market terminal, features, newsletter)
- `/products` — Product catalog with filters
- `/products/:id` — Product detail with buy button
- `/dashboard` — User orders dashboard (pending payments, downloads, newsletter)
- `/sign-in`, `/sign-up` — Clerk auth pages
- `/terms` — Términos de Servicio (Ley 19.496 Chile)
- `/privacy` — Política de Privacidad (Ley 19.628 Chile)
- `/admin` — Admin dashboard (stats, revenue charts)
- `/admin/products` — Product CRUD
- `/admin/orders` — All orders
- `/admin/subscribers` — Newsletter subscribers + campaign composer

## Key API Routes

- `GET /api/products` — list products
- `POST /api/orders` — create order + Stripe session (auth required)
- `POST /api/orders/:id/retry` — regenerate Stripe session for pending order
- `GET /api/orders/:id/verify` — verify Stripe payment and update order status
- `POST /api/stripe/webhook` — Stripe webhook (raw body, registered before express.json)
- `GET /api/payments/config` — returns Stripe publishable key
- `POST /api/email/subscribe` — subscribe to newsletter + send welcome email
- `GET /api/email/unsubscribe?token=` — unsubscribe via token
- `GET /api/admin/stats` — dashboard stats (admin)
- `POST /api/admin/email/campaign` — send email campaign to active subscribers (admin)
- `GET /api/prices` — live market prices (BTC, XAU, XAG, WTI) via Yahoo Finance

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Design System

- Dark theme, electric cyan primary (`#06b6d4`)
- Fonts: Space Grotesk + Courier New (monospace)
- Sharp corners, grid background, terminal aesthetic
- No emojis, all UI copy in Spanish (Chilean market)
