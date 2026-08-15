"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useCart } from "@/context/CartContext";

type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export default function CheckoutPageClient() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setCustomer({
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      addressLine1: String(formData.get("addressLine1") || ""),
      addressLine2: String(formData.get("addressLine2") || ""),
      city: String(formData.get("city") || ""),
      state: String(formData.get("state") || ""),
      zip: String(formData.get("zip") || ""),
      country: String(formData.get("country") || ""),
    });
    setPaymentError(null);
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-12 px-4 py-12 md:grid-cols-2">
      <div>
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

        <fieldset disabled={!!customer} className="contents">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm">
              Full Name
              <input name="fullName" required defaultValue={customer?.fullName} className="rounded border border-neutral-300 px-3 py-2 disabled:bg-neutral-100" />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Email
              <input type="email" name="email" required defaultValue={customer?.email} className="rounded border border-neutral-300 px-3 py-2 disabled:bg-neutral-100" />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Phone
              <input type="tel" name="phone" required defaultValue={customer?.phone} className="rounded border border-neutral-300 px-3 py-2 disabled:bg-neutral-100" />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Street Address
              <input name="addressLine1" required defaultValue={customer?.addressLine1} className="rounded border border-neutral-300 px-3 py-2 disabled:bg-neutral-100" />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Apt / Suite (optional)
              <input name="addressLine2" defaultValue={customer?.addressLine2} className="rounded border border-neutral-300 px-3 py-2 disabled:bg-neutral-100" />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-sm">
                City
                <input name="city" required defaultValue={customer?.city} className="rounded border border-neutral-300 px-3 py-2 disabled:bg-neutral-100" />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                State
                <input name="state" required defaultValue={customer?.state} className="rounded border border-neutral-300 px-3 py-2 disabled:bg-neutral-100" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-sm">
                ZIP Code
                <input name="zip" required defaultValue={customer?.zip} className="rounded border border-neutral-300 px-3 py-2 disabled:bg-neutral-100" />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Country
                <input
                  name="country"
                  required
                  defaultValue={customer?.country ?? "United States"}
                  className="rounded border border-neutral-300 px-3 py-2 disabled:bg-neutral-100"
                />
              </label>
            </div>

            {!customer && (
              <button
                type="submit"
                className="mt-2 w-fit rounded bg-brand-navy px-5 py-2.5 text-sm font-medium text-brand-white hover:opacity-90"
              >
                Continue to Payment
              </button>
            )}
          </form>
        </fieldset>

        {customer && (
          <div className="mt-6 flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setCustomer(null)}
              className="w-fit text-sm text-brand-navy hover:underline"
            >
              Edit information
            </button>

            <PayPalScriptProvider
              options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, currency: "USD" }}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={async () => {
                  const res = await fetch("/api/paypal/create-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
                      customer,
                    }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Failed to create order");
                  return data.paypalOrderId;
                }}
                onApprove={async (data) => {
                  const res = await fetch("/api/paypal/capture-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ paypalOrderId: data.orderID }),
                  });
                  const result = await res.json();
                  if (!res.ok || !result.success) {
                    setPaymentError(result.error || "Payment could not be completed.");
                    return;
                  }
                  clear();
                  const params = new URLSearchParams({ order: result.orderId });
                  if (result.warning) params.set("warning", result.warning);
                  router.push(`/checkout/success?${params.toString()}`);
                }}
                onError={() => {
                  setPaymentError("Something went wrong with PayPal. Please try again.");
                }}
                onCancel={() => {
                  setPaymentError("Payment was cancelled.");
                }}
              />
            </PayPalScriptProvider>

            {paymentError && <p className="text-sm text-red-600">{paymentError}</p>}
          </div>
        )}
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
