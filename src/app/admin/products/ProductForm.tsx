"use client";

import { useActionState } from "react";
import { SPORTS } from "@/types/product";
import type { ProductFormState } from "./actions";

type DefaultValues = {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  category?: string;
  sport?: string;
  signerName?: string;
  condition?: string;
  authenticated?: boolean;
  published?: boolean;
  imageUrl?: string;
};

export default function ProductForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  defaultValues?: DefaultValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} encType="multipart/form-data" className="flex max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Product Name
        <input
          name="name"
          required
          defaultValue={defaultValues?.name}
          className="rounded border border-neutral-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Signer Name
        <input
          name="signerName"
          required
          defaultValue={defaultValues?.signerName}
          className="rounded border border-neutral-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea
          name="description"
          rows={4}
          defaultValue={defaultValues?.description}
          className="rounded border border-neutral-300 px-3 py-2"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Price ($)
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            required
            defaultValue={defaultValues?.price}
            className="rounded border border-neutral-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Quantity
          <input
            type="number"
            name="quantity"
            min="0"
            step="1"
            required
            defaultValue={defaultValues?.quantity ?? 1}
            className="rounded border border-neutral-300 px-3 py-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Sport
          <select
            name="sport"
            required
            defaultValue={defaultValues?.sport ?? ""}
            className="rounded border border-neutral-300 px-3 py-2"
          >
            <option value="" disabled>
              Select a sport
            </option>
            {SPORTS.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Category
          <input
            name="category"
            defaultValue={defaultValues?.category}
            className="rounded border border-neutral-300 px-3 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Condition
        <input
          name="condition"
          required
          defaultValue={defaultValues?.condition}
          placeholder="e.g. Mint, Near Mint"
          className="rounded border border-neutral-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Product Photo
        {defaultValues?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={defaultValues.imageUrl} alt="" className="mb-2 h-32 w-32 object-cover" />
        )}
        <input type="file" name="image" accept="image/png,image/jpeg,image/webp" className="text-sm" />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="authenticated" defaultChecked={defaultValues?.authenticated ?? true} />
        Authenticated
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={defaultValues?.published ?? false} />
        Published (visible on the storefront)
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-brand-navy px-4 py-2 text-sm font-medium text-brand-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving..." : submitLabel}
      </button>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
