"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

const FULFILLMENT_STATUSES = ["unfulfilled", "shipped", "delivered"] as const;
type FulfillmentStatus = (typeof FULFILLMENT_STATUSES)[number];

function isFulfillmentStatus(value: unknown): value is FulfillmentStatus {
  return typeof value === "string" && (FULFILLMENT_STATUSES as readonly string[]).includes(value);
}

export async function updateFulfillmentStatus(orderId: string, formData: FormData) {
  const status = formData.get("fulfillmentStatus");
  if (!isFulfillmentStatus(status)) return;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ fulfillment_status: status })
    .eq("id", orderId);

  if (error) throw new Error(`Failed to update order: ${error.message}`);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}
