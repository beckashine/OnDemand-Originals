import Link from "next/link";

export const metadata = {
  title: "Order Confirmed | On Demand Originals",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; warning?: string }>;
}) {
  const { order, warning } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="mb-4 text-2xl font-bold">Thank You For Your Order</h1>
      {order && (
        <p className="mb-4 text-sm text-neutral-500">
          Order confirmation: <span className="font-mono text-brand-black">{order}</span>
        </p>
      )}
      <p className="mb-8 text-sm text-neutral-600">
        We&apos;ve received your order and will be in touch regarding shipping.
      </p>
      {warning && (
        <p className="mb-8 rounded bg-amber-50 px-4 py-3 text-sm text-amber-800">{warning}</p>
      )}
      <Link href="/products" className="text-brand-navy hover:underline">
        Continue Shopping
      </Link>
    </div>
  );
}
