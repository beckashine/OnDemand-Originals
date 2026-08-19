import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/types/product";
import { countPendingDigestProducts } from "@/lib/newsletter-digest";
import { deleteProduct } from "./actions";
import DeleteProductButton from "./DeleteProductButton";
import SendNewsletterButton from "./SendNewsletterButton";

export const metadata = {
  title: "Manage Products | Admin",
};

export const dynamic = "force-dynamic";

type ProductRow = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  published: boolean;
  sport: Product["sport"];
  signer_name: string;
};

export default async function AdminProductsPage() {
  const supabase = createAdminClient();
  const [{ data: products, error }, pendingCount] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, price, quantity, published, sport, signer_name")
      .order("created_at", { ascending: false })
      .returns<ProductRow[]>(),
    countPendingDigestProducts(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded bg-brand-navy px-4 py-2 text-sm font-medium text-brand-white hover:opacity-90"
        >
          Add Product
        </Link>
      </div>

      <SendNewsletterButton pendingCount={pendingCount} />

      {error && <p className="text-sm text-red-600">Failed to load products: {error.message}</p>}

      {!error && products?.length === 0 && (
        <p className="text-sm text-neutral-500">No products yet. Click &quot;Add Product&quot; to create one.</p>
      )}

      {!error && products && products.length > 0 && (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-brand-black text-xs uppercase tracking-wide text-neutral-500">
              <th className="py-2 pr-4">Signer</th>
              <th className="py-2 pr-4">Sport</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Qty</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-neutral-200">
                <td className="py-3 pr-4">{product.signer_name}</td>
                <td className="py-3 pr-4">{product.sport}</td>
                <td className="py-3 pr-4">${product.price.toLocaleString()}</td>
                <td className="py-3 pr-4">{product.quantity}</td>
                <td className="py-3 pr-4">
                  {product.published ? (
                    <span className="text-brand-navy">Published</span>
                  ) : (
                    <span className="text-neutral-400">Draft</span>
                  )}
                  {product.quantity <= 0 && (
                    <span className="ml-2 text-red-600">Sold Out</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-brand-navy hover:underline">
                      Edit
                    </Link>
                    <DeleteProductButton
                      action={deleteProduct.bind(null, product.id)}
                      productName={product.signer_name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
