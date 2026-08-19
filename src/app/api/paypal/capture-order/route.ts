import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { capturePayPalOrder } from "@/lib/paypal";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(`checkout-capture:${ip}`, 15)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  let body: { paypalOrderId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const paypalOrderId = body.paypalOrderId;
  if (!paypalOrderId) {
    return NextResponse.json({ error: "Missing paypalOrderId" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, payment_status")
    .eq("paypal_order_id", paypalOrderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Idempotency guard: don't re-process (or double-decrement inventory) if
  // this order was already captured — e.g. a retried request.
  if (order.payment_status === "paid") {
    return NextResponse.json({ success: true, orderId: order.id });
  }

  const capture = await capturePayPalOrder(paypalOrderId);

  // Critical: this is the actual server-side verification that money was
  // really captured. Never mark an order paid just because the client
  // reached this point — PayPal's own status is the source of truth.
  if (capture.status !== "COMPLETED") {
    await supabase.from("orders").update({ payment_status: "failed" }).eq("id", order.id);
    return NextResponse.json(
      { success: false, error: "Payment was not completed. Please try again." },
      { status: 402 }
    );
  }

  await supabase.from("orders").update({ payment_status: "paid" }).eq("id", order.id);

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", order.id);

  // Decrement stock with an optimistic-concurrency check: read the current
  // quantity, then update only if it hasn't changed since. If two payments
  // for the same one-of-a-kind item race, only one write succeeds — the
  // loser is flagged below instead of silently overselling.
  let inventoryConflict = false;
  for (const item of orderItems ?? []) {
    if (!item.product_id) continue;

    const { data: product } = await supabase
      .from("products")
      .select("quantity")
      .eq("id", item.product_id)
      .single();

    if (!product || product.quantity < item.quantity) {
      inventoryConflict = true;
      continue;
    }

    const { data: updated } = await supabase
      .from("products")
      .update({ quantity: product.quantity - item.quantity })
      .eq("id", item.product_id)
      .eq("quantity", product.quantity)
      .select();

    if (!updated || updated.length === 0) {
      inventoryConflict = true;
    }
  }

  if (inventoryConflict) {
    return NextResponse.json({
      success: true,
      orderId: order.id,
      warning:
        "Your payment was received, but one or more items became unavailable. We will contact you shortly to resolve this.",
    });
  }

  return NextResponse.json({ success: true, orderId: order.id });
}
