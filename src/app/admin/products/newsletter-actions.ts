"use server";

import { revalidatePath } from "next/cache";
import { runNewsletterDigest } from "@/lib/newsletter-digest";

export type SendNewsletterState = { error?: string; message?: string };

// useActionState requires an action shaped (state, formData) even though
// this trigger-only button doesn't read either argument.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function sendNewsletterNow(_prevState: SendNewsletterState): Promise<SendNewsletterState> {
  try {
    const result = await runNewsletterDigest();
    revalidatePath("/admin/products");

    if (!result.sent) {
      return { message: "No new products to announce — nothing sent." };
    }
    return {
      message: `Sent! ${result.count} product${result.count === 1 ? "" : "s"} announced to subscribers.`,
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to send newsletter." };
  }
}
