"use client";

import { useTransition } from "react";

const OPTIONS = ["unfulfilled", "shipped", "delivered"] as const;

export default function FulfillmentStatusSelect({
  action,
  currentStatus,
}: {
  action: (formData: FormData) => Promise<void>;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(() => action(formData))}
      className="inline-flex items-center gap-2"
    >
      <select
        name="fulfillmentStatus"
        defaultValue={currentStatus}
        disabled={isPending}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded border border-neutral-300 px-2 py-1 text-sm capitalize disabled:opacity-50"
      >
        {OPTIONS.map((option) => (
          <option key={option} value={option} className="capitalize">
            {option}
          </option>
        ))}
      </select>
      {isPending && <span className="text-xs text-neutral-400">Saving…</span>}
    </form>
  );
}
