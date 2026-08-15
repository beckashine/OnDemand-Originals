import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (!product) notFound();

  const soldOut = product.quantity <= 0;
  const oneOfOne = product.quantity <= 1;

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-12 md:grid-cols-2">
      <div className="border border-brand-black p-2">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden border border-brand-navy bg-neutral-50">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={`${product.signerName} signed ${product.sport.toLowerCase()} jersey`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <span className="text-xs uppercase tracking-widest text-neutral-400">
              Photo Coming Soon
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-sm uppercase tracking-wide text-neutral-500">
          {product.sport} &middot; {product.condition}
        </p>
        <p className="text-xl text-brand-navy">${product.price.toLocaleString()}</p>
        <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">
          {oneOfOne && "1 of 1"}
          {oneOfOne && product.authenticated && " · "}
          {product.authenticated && "Authenticated"}
        </p>

        {product.description && (
          <p className="text-sm text-neutral-600">{product.description}</p>
        )}

        {soldOut ? (
          <span className="w-fit rounded bg-red-50 px-3 py-1.5 text-sm font-semibold uppercase tracking-wide text-red-600">
            Sold Out
          </span>
        ) : (
          <button
            type="button"
            disabled
            className="w-fit rounded bg-brand-navy px-5 py-2.5 text-sm font-medium text-brand-white opacity-50"
            title="Cart is coming in a later phase"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
