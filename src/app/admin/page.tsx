import Link from "next/link";

export const metadata = {
  title: "Admin | On Demand Originals",
};

export default function AdminDashboardPage() {
  // TODO (Phase 6+): require authenticated admin session before rendering this route.
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Admin</h1>
      <nav className="flex gap-6 text-sm font-medium">
        <Link href="/admin/products" className="hover:underline">
          Products
        </Link>
        <Link href="/admin/orders" className="hover:underline">
          Orders
        </Link>
      </nav>
    </div>
  );
}
