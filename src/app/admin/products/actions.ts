"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { SPORTS, type Sport } from "@/types/product";

export type ProductFormState = { error?: string };

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isSport(value: unknown): value is Sport {
  return typeof value === "string" && (SPORTS as readonly string[]).includes(value);
}

type AdminClient = ReturnType<typeof createAdminClient>;

async function uploadImage(supabase: AdminClient, file: File) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    contentType: file.type,
  });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

function parseProductFields(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceRaw = String(formData.get("price") || "");
  const quantityRaw = String(formData.get("quantity") || "");
  const category = String(formData.get("category") || "").trim();
  const sport = formData.get("sport");
  const signerName = String(formData.get("signerName") || "").trim();
  const condition = String(formData.get("condition") || "").trim();
  const authenticated = formData.get("authenticated") === "on";
  const published = formData.get("published") === "on";

  if (!name) return { error: "Name is required." } as const;
  if (!signerName) return { error: "Signer name is required." } as const;
  if (!condition) return { error: "Condition is required." } as const;
  if (!isSport(sport)) return { error: "Choose a valid sport." } as const;

  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Price must be a non-negative number." } as const;
  }

  const quantity = Number(quantityRaw);
  if (!Number.isInteger(quantity) || quantity < 0) {
    return { error: "Quantity must be a non-negative whole number." } as const;
  }

  return {
    fields: {
      name,
      description,
      price,
      quantity,
      category,
      sport,
      signerName,
      condition,
      authenticated,
      published,
    },
  } as const;
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const parsed = parseProductFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = createAdminClient();

  let imageUrl = "";
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      imageUrl = await uploadImage(supabase, imageFile);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Image upload failed." };
    }
  }

  const baseSlug = slugify(parsed.fields.name) || "product";
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 8)}`;

  const { error } = await supabase.from("products").insert({
    slug,
    name: parsed.fields.name,
    description: parsed.fields.description,
    price: parsed.fields.price,
    image_url: imageUrl,
    quantity: parsed.fields.quantity,
    category: parsed.fields.category,
    published: parsed.fields.published,
    sport: parsed.fields.sport,
    signer_name: parsed.fields.signerName,
    condition: parsed.fields.condition,
    authenticated: parsed.fields.authenticated,
  });

  if (error) return { error: `Failed to save: ${error.message}` };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const parsed = parseProductFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = createAdminClient();

  const updates: Record<string, unknown> = {
    name: parsed.fields.name,
    description: parsed.fields.description,
    price: parsed.fields.price,
    quantity: parsed.fields.quantity,
    category: parsed.fields.category,
    published: parsed.fields.published,
    sport: parsed.fields.sport,
    signer_name: parsed.fields.signerName,
    condition: parsed.fields.condition,
    authenticated: parsed.fields.authenticated,
  };

  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      updates.image_url = await uploadImage(supabase, imageFile);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Image upload failed." };
    }
  }

  const { error } = await supabase.from("products").update(updates).eq("id", id);

  if (error) return { error: `Failed to save: ${error.message}` };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

function storagePathFromPublicUrl(publicUrl: string): string | null {
  const marker = "/product-images/";
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  return publicUrl.slice(index + marker.length);
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient();

  const { data: product } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();

  const imagePath = product?.image_url ? storagePathFromPublicUrl(product.image_url) : null;
  if (imagePath) {
    // Best-effort: don't let a storage cleanup failure block deleting the listing itself.
    await supabase.storage.from("product-images").remove([imagePath]);
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(`Failed to delete: ${error.message}`);

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
