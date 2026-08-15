import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

export const metadata = {
  title: "Admin | On Demand Originals",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="flex items-center gap-4 text-sm">
          {user && <span className="text-neutral-500">{user.email}</span>}
          <form action={logout}>
            <button type="submit" className="font-medium text-brand-navy hover:underline">
              Log Out
            </button>
          </form>
        </div>
      </div>
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
