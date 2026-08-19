import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateFulfillmentStatus } from "../actions";
import FulfillmentStatusSelect from "../FulfillmentStatusSelect";

export const metadata = {
  title: "Order Details | Admin",
};

export const dynamic = "force-dynamic";

type ShippingAddress = {
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type OrderDetail = {
  id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: ShippingAddress;
  subtotal: number;
  total: number;
  payment_status: "pending" | "paid" | "failed" | "cancelled";
  fulfillment_status: "unfulfilled" | "shipped" | "delivered";
  paypal_order_id: string | null;
  created_at: string;
};

type OrderItem = {
  id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single<OrderDetail>(),
    supabase
      .from("order_items")
      .select("id, product_name, unit_price, quantity")
      .eq("order_id", id)
      .returns<OrderItem[]>(),
  ]);

  if (!order) notFound();

  const address = order.shipping_address;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/admin/orders" className="text-sm text-brand-navy hover:underline">
        &larr; Back to Orders
      </Link>

      <div className="mt-4 mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Placed {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <span
          className={`text-sm font-medium capitalize ${
            order.payment_status === "paid"
              ? "text-brand-navy"
              : order.payment_status === "pending"
                ? "text-neutral-500"
                : "text-red-600"
          }`}
        >
          {order.payment_status}
        </span>
      </div>

      <section className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Customer
          </h2>
          <p className="text-sm">{order.customer_name}</p>
          <p className="text-sm text-neutral-600">{order.customer_email}</p>
          <p className="text-sm text-neutral-600">{address.phone}</p>
        </div>
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Shipping Address
          </h2>
          <p className="text-sm text-neutral-600">
            {address.addressLine1}
            {address.addressLine2 ? <>, {address.addressLine2}</> : null}
            <br />
            {address.city}, {address.state} {address.zip}
            <br />
            {address.country}
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Items
        </h2>
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-brand-black text-xs uppercase tracking-wide text-neutral-500">
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Unit Price</th>
              <th className="py-2 pr-4">Qty</th>
              <th className="py-2 pr-4">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id} className="border-b border-neutral-200">
                <td className="py-3 pr-4">{item.product_name}</td>
                <td className="py-3 pr-4">${item.unit_price.toLocaleString()}</td>
                <td className="py-3 pr-4">{item.quantity}</td>
                <td className="py-3 pr-4">${(item.unit_price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-end">
          <div className="text-right text-sm">
            <p className="text-neutral-500">Subtotal: ${order.subtotal.toLocaleString()}</p>
            <p className="text-base font-semibold">Total: ${order.total.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Fulfillment
        </h2>
        <FulfillmentStatusSelect
          action={updateFulfillmentStatus.bind(null, order.id)}
          currentStatus={order.fulfillment_status}
        />
      </section>
    </div>
  );
}
