export const metadata = {
  title: "Cart | On Demand Originals",
};

export default function CartPage() {
  // TODO (Phase 4+): cart line items, quantity controls, subtotal, inventory checks, proceed to checkout.
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Your Cart</h1>
      <p className="text-sm text-neutral-500">Cart is empty.</p>
    </div>
  );
}
