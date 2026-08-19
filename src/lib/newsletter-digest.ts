import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendProductDigestCampaign, type ProductAnnouncement } from "@/lib/brevo";

type ProductRow = {
  id: string;
  slug: string;
  signer_name: string;
  sport: ProductAnnouncement["sport"];
  condition: string;
  description: string;
  price: number;
  image_url: string;
};

export async function countPendingDigestProducts(): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("published", true)
    .eq("notified", false);

  return count ?? 0;
}

/**
 * Sends one digest email for every published-but-not-yet-announced product,
 * then marks them notified. Used by both the cron endpoint and the admin
 * "Send Newsletter Now" button — same logic, two triggers.
 */
export async function runNewsletterDigest(): Promise<{ sent: boolean; count: number }> {
  const supabase = createAdminClient();
  const { data: pending, error } = await supabase
    .from("products")
    .select("id, slug, signer_name, sport, condition, description, price, image_url")
    .eq("published", true)
    .eq("notified", false)
    .order("created_at", { ascending: true })
    .returns<ProductRow[]>();

  if (error) throw new Error(`Failed to load pending products: ${error.message}`);
  if (!pending || pending.length === 0) return { sent: false, count: 0 };

  const products: ProductAnnouncement[] = pending.map((row) => ({
    id: row.id,
    slug: row.slug,
    signerName: row.signer_name,
    sport: row.sport,
    condition: row.condition,
    description: row.description,
    price: row.price,
    imageUrl: row.image_url,
  }));

  await sendProductDigestCampaign(products);

  const { error: updateError } = await supabase
    .from("products")
    .update({ notified: true })
    .in(
      "id",
      products.map((p) => p.id)
    );

  if (updateError) {
    // The email already went out — surface this loudly since a retry would double-send.
    throw new Error(`Digest sent but failed to mark products notified: ${updateError.message}`);
  }

  return { sent: true, count: products.length };
}
