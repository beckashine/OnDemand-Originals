"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function CheckoutPageClient() {
  const { items, subtotal } = useCart();
  const [submitted, setSubmitted] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-8 text-2xl font-bold">Checkout</h1>
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-12 px-4 py-12 md:grid-cols-2">
      <div>
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Full Name
            <input name="fullName" required className="rounded border border-neutral-300 px-3 py-2" />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Email
            <input type="email" name="email" required className="rounded border border-neutral-300 px-3 py-2" />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Phone
            <input type="tel" name="phone" required className="rounded border border-neutral-300 px-3 py-2" />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Street Address
            <input name="addressLine1" required className="rounded border border-neutral-300 px-3 py-2" />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Apt / Suite (optional)
            <input name="addressLine2" className="rounded border border-neutral-300 px-3 py-2" />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm">
              City
              <input name="city" required className="rounded border border-neutral-300 px-3 py-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              State
              <input name="state" required className="rounded border border-neutral-300 px-3 py-2" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm">
              ZIP Code
              <input name="zip" required className="rounded border border-neutral-300 px-3 py-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Country
              <input
                name="country"
                required
                defaultValue="United States"
                className="rounded border border-neutral-300 px-3 py-2"
              />
            </label>
          </div>

          {!submitted ? (
            <button
              type="submit"
              className="mt-2 w-fit rounded bg-brand-navy px-5 py-2.5 text-sm font-medium text-brand-white hover:opacity-90"
            >
              Continue to Payment
            </button>
          ) : (
            <p className="mt-2 text-sm text-neutral-500">
              PayPal payment is coming in the next step — this form isn&apos;t connected to payment yet.
            </p>
          )}
        </form>
      </div>

      <div>
        <h2 className="mb-6 text-lg font-semibold">Order Summary</h2>
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between border-b border-neutral-200 pb-3 text-sm"
            >
              <div>
                <p className="font-medium">{item.signerName}</p>
                <p className="text-neutral-500">Qty {item.quantity}</p>
              </div>
              <p>${(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-right text-lg font-semibold">Subtotal: ${subtotal.toLocaleString()}</p>
      </div>
    </div>
  );
}
