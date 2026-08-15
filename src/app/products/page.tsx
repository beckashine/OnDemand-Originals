import ProductCard from "@/components/product/ProductCard";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-products";

export const metadata = {
  title: "Shop | On Demand Originals",
};

export default function ProductsPage() {
  // TODO (Phase 5+): fetch published products from Supabase instead of placeholder data.
  const products = PLACEHOLDER_PRODUCTS;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-12 text-center text-2xl font-bold">Shop</h1>
      <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
