> **Work in progress** — this project is under active development.

**Live:** [on-demand-originals.netlify.app](https://on-demand-originals.netlify.app)

# On Demand Originals

Full-stack ecommerce site for a sports memorabilia business, built to replace marketplace selling (eBay, etc.) with a direct-to-customer store. Product catalog, cart, PayPal checkout, inventory-safe one-of-a-kind items, an admin CMS, and a newsletter digest system — all custom-built rather than assembled from a platform.

## Features

- **Product catalog & storefront** — Shop page with sport filtering and search, product detail pages, new-arrivals carousel on the homepage.
- **Cart & checkout** — add/remove/update quantity, subtotal, PayPal sandbox payment. Every order is verified server-side against PayPal before being marked paid — reaching a "success" URL is never treated as proof of payment on its own.
- **Inventory-safe purchasing** — many items are one-of-a-kind. Sold-out items are unpurchasable server-side (not just hidden in the UI), and inventory checks are written to avoid race conditions from duplicate/simultaneous purchases.
- **Admin CMS** (`/admin`) — add/edit/delete products, upload and clean up photos, publish/unpublish, mark sold out, view orders and fulfillment status — no code changes required, protected by real authentication.
- **Newsletter** — homepage signup plus a "new products published" digest via Brevo, batching every pending product into a single email rather than one send per product. Triggered manually from the admin Products page (`SendNewsletterButton`) so the client controls timing; an authenticated cron endpoint (`/api/cron/newsletter-digest`) exists for a future automatic schedule but isn't wired to anything yet.
- **Security** — rate limiting on checkout and newsletter signup, PayPal webhook signature verification (`/api/webhooks/paypal`) as defense-in-depth alongside the direct server-side capture check, no secrets in frontend code.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Database / Auth / Storage | Supabase |
| Payments | PayPal (`@paypal/react-paypal-js`, sandbox during development) |
| Email | Brevo (newsletter signup + digest) |
| Styling | Tailwind CSS |

## Project structure

```
src/app/                 routes: homepage, /about, /products, /cart, /checkout, /admin, API routes
src/app/admin/            product CRUD, orders view, newsletter trigger, login (protected)
src/app/api/paypal/       order creation + capture (server-verified payment)
src/app/api/webhooks/     PayPal webhook handler (signature-verified)
src/app/api/newsletter/   signup endpoint
src/app/api/cron/         newsletter digest endpoint (auth via CRON_SECRET, not currently scheduled)
src/components/           product cards, cart count, nav, newsletter form, etc.
src/context/CartContext.tsx  cart state
src/lib/                  Supabase clients, PayPal helpers, Brevo client, rate limiting
supabase/schema.sql        database schema
supabase/migrations/       incremental schema changes
media/                     client-provided brand mockup + logo (source of truth for design)
```

## Running locally

```bash
npm install
npm run dev
```

Copy `.env.local.example` to `.env.local` and fill in real values — see the comments in that file for where each key comes from (Supabase project settings, PayPal Developer dashboard, Brevo API keys):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_API_BASE=
PAYPAL_WEBHOOK_ID=
BREVO_API_KEY=
BREVO_LIST_ID=
BREVO_SENDER_EMAIL=
NEXT_PUBLIC_SITE_URL=
CRON_SECRET=
```

## Status

Architecture decided: Next.js + Supabase + PayPal. Product catalog, admin CMS, cart, checkout (PayPal sandbox, server-verified), newsletter signup + manual digest, and admin auth are built and working. Still pending: final About copy, production PayPal credentials, and a confirmed hosting plan.
