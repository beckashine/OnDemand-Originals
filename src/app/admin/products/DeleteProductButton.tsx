"use client";

export default function DeleteProductButton({
  action,
  productName,
}: {
  action: () => Promise<void>;
  productName: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${productName}"? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-red-600 hover:underline">
        Delete
      </button>
    </form>
  );
}
