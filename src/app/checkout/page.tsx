export const metadata = {
  title: "Checkout | On Demand Originals",
};

export default function CheckoutPage() {
  // TODO (Phase 5+): name, email, shipping address, contact info fields.
  // TODO (Phase 5+): PayPal button, server-side payment verification before marking order paid.
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Checkout</h1>
      <p className="text-sm text-neutral-500">Checkout coming soon.</p>
    </div>
  );
}
