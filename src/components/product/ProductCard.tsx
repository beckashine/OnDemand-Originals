import Link from "next/link";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const soldOut = product.quantity <= 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex flex-col gap-2 border border-neutral-200 p-4 hover:border-black"
    >
      <div className="aspect-square bg-neutral-100" />
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-sm text-neutral-600">${product.price.toFixed(2)}</p>
      {soldOut && (
        <span className="text-xs font-semibold uppercase text-red-600">
          Sold Out
        </span>
      )}
    </Link>
  );
}
