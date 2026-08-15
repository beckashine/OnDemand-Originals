import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const soldOut = product.quantity <= 0;
  const oneOfOne = product.quantity <= 1;

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col">
      {/* Frame */}
      <div className="border border-brand-black p-2">
        <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-brand-navy bg-neutral-50">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={`${product.signerName} signed ${product.sport.toLowerCase()} jersey`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <span className="text-xs uppercase tracking-widest text-neutral-400">
              Photo Coming Soon
            </span>
          )}
        </div>
      </div>

      {/* Placard */}
      <div className="flex flex-col items-center gap-1 pt-4 text-center">
        <p className="text-base font-semibold">{product.signerName}</p>
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          {product.sport} &middot; {product.condition}
        </p>
        <p className="text-sm text-brand-navy">${product.price.toLocaleString()}</p>
        <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-400">
          {oneOfOne && "1 of 1"}
          {oneOfOne && product.authenticated && " · "}
          {product.authenticated && "Authenticated"}
        </p>
        {soldOut && (
          <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-red-600">
            Sold Out
          </span>
        )}
      </div>
    </Link>
  );
}
