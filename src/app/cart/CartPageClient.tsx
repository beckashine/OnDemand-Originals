"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPageClient() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="mb-8 text-2xl font-bold">Your Cart</h1>
        <p className="text-sm text-neutral-500">
          Your cart is empty.{" "}
          <Link href="/products" className="text-brand-navy hover:underline">
            Continue shopping
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Your Cart</h1>

      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-wrap items-center gap-4 border-b border-neutral-200 pb-6"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-brand-navy bg-neutral-50">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.signerName} fill className="object-cover" />
              )}
            </div>

            <div className="min-w-[140px] flex-1">
              <Link href={`/products/${item.slug}`} className="font-medium hover:underline">
                {item.signerName}
              </Link>
              <p className="text-sm text-neutral-500">${item.price.toLocaleString()}</p>
            </div>

            <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
              <label className="flex items-center gap-2 text-sm">
                Qty
                <select
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                  className="rounded border border-neutral-300 px-2 py-1"
                >
                  {Array.from({ length: item.maxQuantity }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <p className="w-20 text-right text-sm font-medium">
                ${(item.price * item.quantity).toLocaleString()}
              </p>

              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <p className="text-lg font-semibold">Subtotal: ${subtotal.toLocaleString()}</p>
        <Link
          href="/checkout"
          className="rounded bg-brand-navy px-5 py-2.5 text-sm font-medium text-brand-white hover:opacity-90"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
