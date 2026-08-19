import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyWebhookSignature } from "@/lib/paypal";

type PayPalCaptureEvent = {
  event_type: string;
  resource?: {
    supplementary_data?: {
      related_ids?: {
        order_id?: string;
      };
    };
  };
};

/**
 * Defense-in-depth alongside the synchronous capture flow in
 * /api/paypal/capture-order (which is what actually marks orders paid on a
 * normal checkout). This catches cases the synchronous flow can miss — e.g.
 * our server crashing between PayPal confirming a capture and us recording
 * it, or PayPal-initiated events like a later refund/dispute.
 *
 * Not wired up in PayPal's dashboard yet — that requires a public URL to
 * register the webhook against (see PAYPAL_WEBHOOK_ID in .env.local.example),
 * which is blocked on the hosting decision. Safe to leave dormant until then.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();

  let event: PayPalCaptureEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  let verified: boolean;
  try {
    verified = await verifyWebhookSignature(
      {
        authAlgo: request.headers.get("paypal-auth-algo"),
        certUrl: request.headers.get("paypal-cert-url"),
        transmissionId: request.headers.get("paypal-transmission-id"),
        transmissionSig: request.headers.get("paypal-transmission-sig"),
        transmissionTime: request.headers.get("paypal-transmission-time"),
      },
      event
    );
  } catch (err) {
    console.error("PayPal webhook verification failed:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }

  if (!verified) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const paypalOrderId = event.resource?.supplementary_data?.related_ids?.order_id;

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED" && paypalOrderId) {
    const supabase = createAdminClient();
    const { data: order } = await supabase
      .from("orders")
      .select("id, payment_status")
      .eq("paypal_order_id", paypalOrderId)
      .single();

    // Idempotent: only acts if the synchronous capture flow hasn't already marked it paid.
    if (order && order.payment_status !== "paid") {
      await supabase.from("orders").update({ payment_status: "paid" }).eq("id", order.id);
    }
  }

  if (event.event_type === "PAYMENT.CAPTURE.DENIED" && paypalOrderId) {
    const supabase = createAdminClient();
    const { data: order } = await supabase
      .from("orders")
      .select("id, payment_status")
      .eq("paypal_order_id", paypalOrderId)
      .single();

    if (order && order.payment_status === "pending") {
      await supabase.from("orders").update({ payment_status: "failed" }).eq("id", order.id);
    }
  }

  // Other event types (refunds, disputes, etc.) are acknowledged but not
  // acted on yet — the orders table doesn't track those states. Revisit if
  // the client needs refund tracking.

  return NextResponse.json({ ok: true });
}
