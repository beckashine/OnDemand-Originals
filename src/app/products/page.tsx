import ProductCard from "@/components/product/ProductCard";
import SportFilterNav from "@/components/product/SportFilterNav";
import { getPublishedProducts } from "@/lib/products";
import { SPORTS, type Sport } from "@/types/product";

export const metadata = {
  title: "Shop | On Demand Originals",
};

export const dynamic = "force-dynamic";

function isSport(value: string | undefined): value is Sport {
  return SPORTS.includes(value as Sport);
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; q?: string }>;
}) {
  const { sport, q } = await searchParams;
  const activeSport = isSport(sport) ? sport : undefined;

  const products = await getPublishedProducts(activeSport, q);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display mb-2 text-center text-3xl tracking-wide uppercase">Shop</h1>
      <p className="mb-10 text-center text-sm text-neutral-500">
        {q ? <>Search results for &ldquo;{q}&rdquo;</> : <>&nbsp;</>}
      </p>
      <div className="flex flex-col gap-10 md:flex-row">
        <SportFilterNav activeSport={activeSport} />
        <div className="flex-1">
          {products.length === 0 ? (
            <p className="text-sm text-neutral-500">
              {q ? "No items match your search." : "No items in this category yet."}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
