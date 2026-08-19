import { createClient } from "@/lib/supabase/server";
import type { Product, Sport } from "@/types/product";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity: number;
  category: string;
  published: boolean;
  sport: Sport;
  signer_name: string;
  condition: string;
  authenticated: boolean;
};

function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    imageUrl: row.image_url,
    quantity: row.quantity,
    category: row.category,
    published: row.published,
    sport: row.sport,
    signerName: row.signer_name,
    condition: row.condition,
    authenticated: row.authenticated,
  };
}

/** Published products only — RLS enforces this even if the filter below is removed. */
export async function getPublishedProducts(
  sport?: Sport,
  searchQuery?: string,
  limit?: number,
): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select("*").eq("published", true);

  if (sport) {
    query = query.eq("sport", sport);
  }

  const trimmed = searchQuery?.trim();
  if (trimmed) {
    // Strip PostgREST filter-syntax characters so user input can't alter the .or() expression.
    const safe = trimmed.replace(/[,()%]/g, " ").trim();
    if (safe) {
      query = query.or(`name.ilike.%${safe}%,signer_name.ilike.%${safe}%`);
    }
  }

  query = query.order("created_at", { ascending: false });
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query.returns<ProductRow[]>();

  if (error || !data) return [];
  return data.map(mapRowToProduct);
}

export async function getPublishedProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single<ProductRow>();

  if (error || !data) return null;
  return mapRowToProduct(data);
}
