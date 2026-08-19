import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = {
  title: "Orders | Admin",
};

export const dynamic = "force-dynamic";

type OrderRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  payment_status: "pending" | "paid" | "failed" | "cancelled";
  fulfillment_status: "unfulfilled" | "shipped" | "delivered";
  created_at: string;
};

function PaymentStatusBadge({ status }: { status: OrderRow["payment_status"] }) {
  const styles: Record<OrderRow["payment_status"], string> = {
    paid: "text-brand-navy",
    pending: "text-neutral-500",
    failed: "text-red-600",
    cancelled: "text-red-600",
  };
  return <span className={`capitalize ${styles[status]}`}>{status}</span>;
}

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, customer_name, customer_email, total, payment_status, fulfillment_status, created_at")
    .order("created_at", { ascending: false })
    .returns<OrderRow[]>();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Orders</h1>

      {error && <p className="text-sm text-red-600">Failed to load orders: {error.message}</p>}

      {!error && orders?.length === 0 && (
        <p className="text-sm text-neutral-500">No orders yet.</p>
      )}

      {!error && orders && orders.length > 0 && (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-brand-black text-xs uppercase tracking-wide text-neutral-500">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Payment</th>
              <th className="py-2 pr-4">Fulfillment</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-neutral-200">
                <td className="py-3 pr-4 whitespace-nowrap">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4">
                  <div>{order.customer_name}</div>
                  <div className="text-xs text-neutral-500">{order.customer_email}</div>
                </td>
                <td className="py-3 pr-4">${order.total.toLocaleString()}</td>
                <td className="py-3 pr-4">
                  <PaymentStatusBadge status={order.payment_status} />
                </td>
                <td className="py-3 pr-4 capitalize">{order.fulfillment_status}</td>
                <td className="py-3 pr-4">
                  <Link href={`/admin/orders/${order.id}`} className="text-brand-navy hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
