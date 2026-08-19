"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      {direction === "left" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  );
}

export default function ProductCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 200;
    track.scrollBy({ left: direction === "left" ? -(cardWidth + 14) : cardWidth + 14, behavior: "smooth" });
  }

  if (products.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-neutral-500">
        New arrivals coming soon — check back shortly.
      </p>
    );
  }

  return (
    <div className="relative mx-auto max-w-6xl px-10 sm:px-14">
      <button
        type="button"
        aria-label="Previous items"
        onClick={() => scroll("left")}
        className="absolute top-1/2 left-0 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-white text-brand-black shadow-lg sm:flex"
      >
        <ArrowIcon direction="left" />
      </button>

      <div
        ref={trackRef}
        className={`flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          products.length <= 4 ? "justify-center" : "justify-start"
        }`}
      >
        {products.map((product) => {
          const soldOut = product.quantity <= 0;
          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="flex w-[170px] shrink-0 snap-start flex-col border border-brand-gray-line bg-brand-gray-bg sm:w-[200px]"
            >
              <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden border-b border-brand-gray-line">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={`${product.signerName} signed ${product.sport.toLowerCase()} memorabilia`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                ) : (
                  <span className="px-2 text-center text-[11px] font-semibold tracking-widest text-neutral-400 uppercase">
                    Photo Coming Soon
                  </span>
                )}
                {soldOut && (
                  <span className="absolute top-2 left-2 bg-brand-black px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand-white uppercase">
                    Sold Out
                  </span>
                )}
              </div>
              <div className="bg-brand-white px-3.5 py-3">
                <p className="text-sm font-bold tracking-wide uppercase">{product.signerName}</p>
                <p className="mt-0.5 text-xs text-neutral-600">${product.price.toLocaleString()}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Next items"
        onClick={() => scroll("right")}
        className="absolute top-1/2 right-0 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-white text-brand-black shadow-lg sm:flex"
      >
        <ArrowIcon direction="right" />
      </button>
    </div>
  );
}
