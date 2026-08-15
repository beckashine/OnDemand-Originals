-- On Demand Originals — initial database schema
-- Run this once in the Supabase Dashboard -> SQL Editor.
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE where possible.

-- Shared trigger: keep updated_at current on every row update.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  image_url text not null default '',
  quantity integer not null default 0 check (quantity >= 0),
  category text not null default '',
  published boolean not null default false,
  sport text not null check (sport in ('Baseball', 'Basketball', 'Football', 'Hockey', 'Soccer')),
  signer_name text not null,
  condition text not null,
  authenticated boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_published_idx on products (published);
create index if not exists products_sport_idx on products (sport);

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

alter table products enable row level security;

drop policy if exists "Public can view published products" on products;
create policy "Public can view published products"
  on products for select
  using (published = true);

-- No insert/update/delete policies: all writes happen server-side later
-- (admin CMS) using the service-role key, which bypasses RLS.

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  shipping_address jsonb not null,
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  total numeric(10, 2) not null check (total >= 0),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'cancelled')),
  fulfillment_status text not null default 'unfulfilled'
    check (fulfillment_status in ('unfulfilled', 'shipped', 'delivered')),
  paypal_order_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

alter table orders enable row level security;
-- No policies at all: orders contain PII, so there is zero public access.
-- Checkout and the admin panel both use the service-role key server-side.

-- ---------------------------------------------------------------------------
-- order_items
-- ---------------------------------------------------------------------------
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on order_items (order_id);

alter table order_items enable row level security;
-- Same as orders: no public policies, service-role only.

-- ---------------------------------------------------------------------------
-- subscribers
-- ---------------------------------------------------------------------------
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz not null default now()
);

alter table subscribers enable row level security;

drop policy if exists "Public can subscribe" on subscribers;
create policy "Public can subscribe"
  on subscribers for insert
  with check (true);

-- No select/update/delete policy: the signup list itself is never
-- publicly readable, only insertable.
