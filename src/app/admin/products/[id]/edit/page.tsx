import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import ProductForm from "../../ProductForm";
import { updateProduct } from "../../actions";

export const metadata = {
  title: "Edit Product | Admin",
};

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single();

  if (error || !product) notFound();

  const updateWithId = updateProduct.bind(null, id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Edit Product</h1>
      <ProductForm
        action={updateWithId}
        submitLabel="Save Changes"
        defaultValues={{
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          category: product.category,
          sport: product.sport,
          signerName: product.signer_name,
          condition: product.condition,
          authenticated: product.authenticated,
          published: product.published,
          imageUrl: product.image_url,
        }}
      />
    </div>
  );
}
