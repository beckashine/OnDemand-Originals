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
export async function getPublishedProducts(sport?: Sport): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select("*").eq("published", true);

  if (sport) {
    query = query.eq("sport", sport);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .returns<ProductRow[]>();

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
