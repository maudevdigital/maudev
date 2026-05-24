# MauDev ÔÇö Sales Platform

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
- **Payments**: Flow.cl (Chilean payment processor, HMAC-SHA256 signing, sandbox mode)
- **Email**: Resend (via Replit Resend integration) ÔÇö welcome emails, campaigns, unsubscribe
- **Validation**: Zod (zod/v4), drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild

## Artifacts

- `artifacts/api-server` ÔÇö Express 5 REST API, port 8080
- `artifacts/maudev` ÔÇö React + Vite frontend, port 20866, route `/`

## Database Schema

- `products` ÔÇö Pine Script indicators, MT5 tools, digital services (with `downloadUrl`, `manualUrl` for paid file access)
- `orders` ÔÇö purchases with Flow token/URL (stored in `stripeSessionId`, `stripePaymentUrl` columns)
- `email_subscribers` ÔÇö newsletter subscribers (`status`: active/unsubscribed, `unsubscribeToken`)
- `blog_posts` ÔÇö blog articles (title, slug, content, excerpt, imageUrl, published, publishedAt)

## Key Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection URL |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk public key (frontend) |
| `CLERK_SECRET_KEY` | Clerk secret key (backend) |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook verification |
| `ADMIN_EMAILS` | Comma-separated list of admin email addresses |
| `FLOW_API_KEY` | Flow.cl API key |
| `FLOW_SECRET_KEY` | Flow.cl secret key for HMAC-SHA256 signing |
| `BASE_URL_PUBLIC` | Public app URL for Flow redirect URLs (default: REPLIT_DOMAINS) |

> Resend credentials are managed via Replit integrations (no env vars needed).

## Payment Flow (Flow.cl)

1. User clicks "Comprar" ÔåÆ `POST /api/orders` creates order + Flow payment (HMAC-SHA256 signed)
2. Frontend redirects user to Flow.cl payment page
3. User pays ÔåÆ Flow sends webhook `POST /api/payments/flow/webhook`
4. Flow redirects user to `GET|POST /api/payments/flow/confirm` ÔåÆ marks order paid ÔåÆ `forceRedirect(302)` to dashboard (must use `res.writeHead(302)` not `res.redirect()` because Express 5 converts POST redirects to 307)
5. Dashboard shows expandable paid order cards:
   - **Trading scripts**: download file + manual panels
   - **Digital services**: "SERVICIO CONTRATADO" panel with 3-step delivery process
6. Mock mode: when Flow keys not configured, orders redirect to `/dashboard?payment=success&orderId=X&mock=true` ÔåÆ `POST /orders/:id/mock-complete` marks order paid

## Product File Management (Object Storage)

- Files hosted via Replit Object Storage (GCS-backed)
- Admin uploads indicator files and manuals directly from `/admin/products` using `FileUploadField` component
- Upload flow: presigned URL (`POST /api/storage/uploads/request-url`, admin-only) ÔåÆ PUT to GCS ÔåÆ store object path + filename in DB
- Files served via `GET /api/storage/objects/{path}` with `Content-Disposition: attachment` for proper download
- Dashboard uses authenticated fetch (Bearer token) to download files ÔÇö no direct links
- Public product API endpoints strip `downloadUrl`/`manualUrl` (security: only accessible via paid order flow)
- Orders API includes `downloadUrl`, `manualUrl`, `productCategory` only for paid orders

## Product Categories & Pricing

- **Product categories**: `trading_scripts` (trading indicators/scripts) and `digital_service` (development services)
- **Subcategories**: `market_structure` (TradingView Pine Script), `mt5_mql5` (MetaTrader 5), `landing_page`, `fullstack`, `mobile_app`, `automation` (n8n agents)
- **Post-payment flow**: Trading scripts ÔåÆ download files + manual; Digital services ÔåÆ "te contactaremos" confirmation with 3-step process + campaign composer access
- **Payment method logic**: Backend sends `paymentMethod` to Flow based on price: <$100K ÔåÆ Khipu transfer (method 22, 0.99%); $100K-$500K ÔåÆ Webpay single payment (method 9); >$500K ÔåÆ Webpay with installments (method 1, 3/6/12 cuotas). Frontend shows matching UI per tier

## Campaign Composer

- **Route**: `/admin/campaigns` ÔÇö admin-only campaign composer in the admin panel
- **Features**: Email templates (Promoci├│n, Actualizaci├│n, Newsletter), recipient list input, HTML body editor with live preview, batch sending via Resend
- **Backend**: `POST /api/admin/campaigns/send` ÔÇö admin-only, max 50 recipients per campaign, wraps content in MauDev email template
- **Discount system**: `originalPrice` column (nullable) stores previous price; when set and > current price, UI shows crossed-out original, current price, and % discount badge
- **Featured products**: Boolean flag; shown on home page hero section

## Security Model

- **Admin access**: Only `ADMIN_EMAILS` (env var) can access admin endpoints; verified via Clerk user email lookup
- **Admin layout guard**: Frontend admin layout checks auth state + calls `GET /api/admin/check`; shows sign-in form if not authenticated, "Acceso Denegado" if not admin
- **Admin check endpoint**: `GET /api/admin/check` ÔÇö lightweight verification for frontend admin UI visibility
- **File upload**: `POST /api/storage/uploads/request-url` requires `requireAdmin` middleware
- **File download**: `GET /api/storage/objects/*` requires `requireAuth` + verifies user has a paid order for a product whose `downloadUrl`/`manualUrl` matches the requested file
- **Product data**: Public product endpoints (`GET /products`) strip `downloadUrl`/`manualUrl` via `stripSensitiveFields()`; admin endpoint (`GET /admin/products`) returns full data
- **Order ownership**: All order endpoints verify `userId` matches the authenticated user
- **Navbar admin link**: Only visible after server-side admin verification via `/api/admin/check`

## Email Flow (Resend)

- All emails use shared MauDev branded template (`email-template.ts`): dark theme, cyan accents, monospace font
- On subscribe: generate unsubscribeToken, save to DB, send welcome HTML email
- On payment confirmed (webhook): sends payment confirmation email with order details and next steps
- `GET /api/email/unsubscribe?token=` ÔåÆ mark subscriber as unsubscribed
- Admin campaign: `POST /admin/email/campaign` ÔåÆ send to all active subscribers in batches of 100 (wrapped in branded template)
- User campaign: `POST /api/campaigns/send` ÔåÆ wrapped in branded template

## Pages

- `/` ÔÇö Landing page (hero with live market terminal, features, newsletter)
- `/products` ÔÇö Product catalog with filters
- `/products/:id` ÔÇö Product detail with buy button
- `/dashboard` ÔÇö User dashboard (pending payments, paid order history with expandable download/manual panels, newsletter)
- `/sign-in`, `/sign-up` ÔÇö Clerk auth pages
- `/terms` ÔÇö T├®rminos de Servicio (Ley 19.496 Chile)
- `/privacy` ÔÇö Pol├¡tica de Privacidad (Ley 19.628 Chile)
- `/blog` ÔÇö Blog listing (published posts)
- `/blog/:slug` ÔÇö Blog post detail
- `/admin` ÔÇö Admin dashboard (stats, revenue charts)
- `/admin/products` ÔÇö Product CRUD
- `/admin/orders` ÔÇö All orders
- `/admin/subscribers` ÔÇö Newsletter subscribers + campaign composer
- `/admin/blog` ÔÇö Blog post CRUD (create/edit/delete, publish/draft toggle, preview)
- `/admin/campaigns` ÔÇö Email campaign composer (templates, recipients, HTML editor, live preview)

## Key API Routes

- `GET /api/products` ÔÇö list products
- `POST /api/orders` ÔÇö create order + Flow payment (auth required)
- `POST /api/orders/:id/retry` ÔÇö regenerate Flow payment for pending order
- `GET /api/orders/:id/verify` ÔÇö verify order status
- `GET /api/payments/flow/confirm` ÔÇö Flow payment confirmation redirect
- `POST /api/payments/flow/webhook` ÔÇö Flow webhook for payment status updates
- `POST /api/email/subscribe` ÔÇö subscribe to newsletter + send welcome email
- `GET /api/email/unsubscribe?token=` ÔÇö unsubscribe via token
- `GET /api/admin/stats` ÔÇö dashboard stats (admin)
- `POST /api/admin/email/campaign` ÔÇö send email campaign to active subscribers (admin)
- `GET /api/prices` ÔÇö live market prices (BTC, XAU, XAG, WTI) via Yahoo Finance
- `GET /api/blog` ÔÇö list published blog posts
- `GET /api/blog/:slug` ÔÇö get blog post by slug
- `POST /api/admin/blog` ÔÇö create blog post (admin)
- `PUT /api/admin/blog/:id` ÔÇö update blog post (admin)
- `DELETE /api/admin/blog/:id` ÔÇö delete blog post (admin)

## Blog SEO

- **Dynamic meta tags**: `react-helmet-async` + `SEOHead` component sets title, description, keywords, canonical, Open Graph, Twitter Card per page
- **JSON-LD structured data**: Article schema + BreadcrumbList schema on each blog post
- **Semantic HTML**: `<article>`, `<header>`, `<footer>`, `<nav>`, `<time>`, `<figure>` + microdata (`itemScope`/`itemProp`)
- **SEO fields in DB**: `metaTitle`, `metaDescription`, `metaKeywords`, `canonicalUrl`, `author`, `readingTimeMin`, `tags` ÔÇö all editable from admin
- **Admin SEO panel**: Toggle between content/SEO/preview tabs; live Google SERP preview, character counters for meta title (60) and description (160)
- **Sitemap**: `GET /sitemap.xml` ÔÇö dynamic XML sitemap with all published blog posts + static pages
- **Robots.txt**: `GET /robots.txt` ÔÇö allows blog/products, disallows admin/dashboard/auth pages
- **Reading time**: Auto-calculated from word count (200 wpm), stored in DB
- **Tags**: Comma-separated, displayed as badges on posts

## Key Commands

- `pnpm run typecheck` ÔÇö full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` ÔÇö regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/db run push` ÔÇö push DB schema changes (dev only)

## Design System

- Dark theme, electric cyan primary (`#06b6d4`)
- Fonts: Space Grotesk + Courier New (monospace)
- Sharp corners, grid background, terminal aesthetic
- No emojis, all UI copy in Spanish (Chilean market)