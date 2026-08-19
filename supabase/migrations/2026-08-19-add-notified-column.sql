-- One-time migration: adds the "notified" column used to batch new-product
-- newsletter emails into a once-a-day digest instead of one email per product.
-- Run this ONCE in the Supabase Dashboard -> SQL Editor (not safe to re-run —
-- see the note below). schema.sql already includes this column for fresh installs.

alter table products add column if not exists notified boolean not null default false;

-- Backfill: mark already-published products as already notified so they
-- aren't swept into the first digest run retroactively. Only meaningful the
-- first time this runs — re-running it after the digest cron is live would
-- incorrectly mark real pending items as notified, so don't re-run this file.
update products set notified = true where published = true and notified = false;
