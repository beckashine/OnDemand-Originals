"use client";

import { useActionState } from "react";
import { sendNewsletterNow, type SendNewsletterState } from "./newsletter-actions";

const initialState: SendNewsletterState = {};

export default function SendNewsletterButton({ pendingCount }: { pendingCount: number }) {
  const [state, formAction, isPending] = useActionState(sendNewsletterNow, initialState);

  return (
    <div className="mb-8 flex flex-col gap-2 border border-brand-gray-line bg-neutral-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-neutral-600">
        {pendingCount > 0
          ? `${pendingCount} published product${pendingCount === 1 ? "" : "s"} awaiting a newsletter announcement.`
          : "No products awaiting a newsletter announcement — all caught up."}
      </p>
      <form action={formAction}>
        <button
          type="submit"
          disabled={isPending || pendingCount === 0}
          className="rounded bg-brand-navy px-4 py-2 text-sm font-medium text-brand-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? "Sending…" : "Send Newsletter Now"}
        </button>
      </form>
      {(state.message || state.error) && (
        <p className={`text-sm sm:basis-full ${state.error ? "text-red-600" : "text-brand-navy"}`}>
          {state.error || state.message}
        </p>
      )}
    </div>
  );
}
