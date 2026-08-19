# On Demand Originals — Project Context

## Business
- Sports memorabilia ecommerce business.
- Moving away from marketplaces (eBay, etc.) — this website is the primary sales channel.
- Brand colors: black (#111111), white, royal blue (#1B3F8F), with yellow (#F4C400) as a secondary accent (newsletter block, badges, CTA highlights). Fonts: Anton (display/headings) + Inter (body), both via Google Fonts.
- Should feel like a premium collectibles business, not a generic ecommerce template. Emphasize the memorabilia itself over heavy graphics.
- Real logo file (`public/logo.JPEG`) and an approved homepage mockup (`media/index.html`) have been provided by the client — treat these as the source of truth for brand look, not the earlier placeholder description.

## Tech stack (decided)
- **Frontend/backend**: Next.js (App Router)
- **Database/auth/storage**: Supabase
- **Payments**: PayPal (sandbox first, then production credentials)
- **Hosting**: GoDaddy Node.js Hosting (currently in beta) is the leading candidate, since the client's domain is already at GoDaddy — needs confirming which GoDaddy plan the client actually has (classic Web Hosting vs. the newer Node.js Hosting product). Vercel Pro is the fallback if GoDaddy's beta doesn't support something we need (note: Vercel's free Hobby tier prohibits commercial use, so Pro at $20/seat/month would be required).
- **Domain**: registered at GoDaddy — stays there regardless of where the app is hosted; DNS gets pointed at wherever we deploy.

## Budget & scope constraints
- ~$2,000 one-time build budget. No ongoing maintenance retainer is included in scope.
- Do not over-engineer. Prefer the simpler, more secure, more maintainable option whenever there's a choice.
- Flag anything that looks like scope creep before building it.

## Core features required

1. **Homepage**: logo, clean nav, hero/intro, new arrivals, featured memorabilia, newsletter signup, about/intro section, clear CTAs, footer.
2. **Product catalog**: name, description, image(s), price, inventory quantity, availability, category, published/unpublished status.
3. **Product page**: large image, title, description, price, availability, quantity selector where appropriate, add-to-cart button.
4. **Cart**: add/remove/change quantity, subtotal, shipping/tax if configured, proceed to checkout. Must account for inventory and never allow purchasing unavailable stock.
5. **Checkout**: name, email, shipping address, contact info, order details — minimum fields only, nothing unnecessary.
6. **PayPal payments**: sandbox mode during development; never mark an order paid just because the customer reached a success page — verify payment server-side; handle failed/cancelled/incomplete payments; secrets live in environment variables only, never in frontend code; separate dev/test credentials from production.
7. **Inventory**: many items are one-of-a-kind. Zero-inventory items must be genuinely unpurchasable (enforced server-side, not just a hidden button) and shown as sold out. Consider race conditions / duplicate simultaneous purchases explicitly.
8. **Orders (admin)**: view orders, customer info, products purchased, order total, payment status, order date, fulfillment status. Keep this simple — no enterprise order management system.
9. **Newsletter**: signup on homepage. "New product published → subscriber email" workflow, batched into a digest (not one email per product — every published-but-not-yet-announced product gets bundled into a single email listing all of them). Client-triggered via a "Send Newsletter Now" button in the admin Products page (decided 2026-08-19 — client wants manual control over timing rather than a fixed automatic schedule), showing how many products are pending announcement. Provider: **Brevo** (chosen 2026-08-19 — free tier includes automation and 300 emails/day with no practical contact cap; Mailchimp's free tier no longer supports automation at all, requiring their $90/mo plan, which conflicts with the no-retainer budget). Email includes branding, product image, name, short description, price, link to product page, clear CTA.
10. **Admin/CMS**: client must be able to add/edit products, upload images, change price/inventory, publish/unpublish, mark sold out, and view orders — all without touching code. Since we're not using an existing platform's built-in admin, this needs to be built as part of the app. Keep it as simple as it can be while still covering these needs.

## Security requirements
- Never expose API keys/secrets in frontend code — environment variables only.
- Verify PayPal payment status server-side before marking any order as paid.
- Admin routes need real authentication and authorization.
- Input validation on all forms; rate limiting where it makes sense (checkout, newsletter signup) — done (`src/lib/rate-limit.ts`, in-memory per-IP).
- Never store raw payment card data.

## Information still needed from the client (don't invent placeholders beyond what's marked TBD above)
- Final website copy / About section text
- Contact info, shipping policy, return/refund policy
- Tax requirements
- Shipping rates or shipping provider
- PayPal Business account info
- Initial products: names, prices, condition, photos, descriptions, categories, starting inventory counts
- Confirmation of which exact GoDaddy hosting plan the client has
- Any social links or legal/privacy requirements
- Brevo account (API key, subscriber list ID, verified sender email) — integration is built, just needs real credentials in `.env.local`

## How to work with me on this
- I'm a beginner going through this for the first time — explain plainly, don't assume prior dev experience.
- Work in phases. Don't dump the whole app on me at once.
- For every major step: tell me what we're building and why, tell me exactly what I need to do, give me the code/config, tell me where it goes, tell me how to test it, tell me what success looks like — then wait for my confirmation before moving to the next step.

## Status
- Architecture decided: custom Next.js + Supabase + PayPal. Hosting decision pending confirmation of the client's actual GoDaddy plan.
- Built and working: product catalog + admin CMS (create/edit/delete, photo upload/cleanup), Shop page with sport filter and search, product detail pages, cart, checkout with real PayPal sandbox payment (server-side verified, inventory-safe), admin auth, homepage matching the client's approved mockup (new-arrivals carousel, newsletter block).
- Built and working: newsletter signup + new-product-published digest emails via Brevo, triggered by a "Send Newsletter Now" button in admin (real credentials live in `.env.local`, verified end-to-end including multi-product batching and the manual trigger). A `/api/cron/newsletter-digest` endpoint (protected by `CRON_SECRET`) also exists and works if called, for a possible future automatic schedule — not currently wired to anything, since the client chose manual control instead. Also built: admin orders view.
- Built and working: rate limiting on checkout + newsletter endpoints, PayPal webhook (`/api/webhooks/paypal`, verifies signatures, defense-in-depth — not wired up in PayPal's dashboard yet since that needs a real public URL), real favicon/icons generated from the logo, SEO/Open Graph/Twitter meta tags.
- Not yet built: About page copy, production PayPal credentials, final hosting decision (all waiting on the client).
