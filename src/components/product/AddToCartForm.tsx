"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

export default function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        signerName: product.signerName,
        price: product.price,
        imageUrl: product.imageUrl,
        maxQuantity: product.quantity,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3">
      {product.quantity > 1 && (
        <label className="flex items-center gap-2 text-sm">
          Quantity
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="rounded border border-neutral-300 px-2 py-1"
          >
            {Array.from({ length: product.quantity }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      )}
      <button
        type="button"
        onClick={handleAdd}
        className="w-fit rounded bg-brand-navy px-5 py-2.5 text-sm font-medium text-brand-white hover:opacity-90"
      >
        {added ? "Added to Cart" : "Add to Cart"}
      </button>
    </div>
  );
}
