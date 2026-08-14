export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // TODO (Phase 3+): fetch product by slug from Supabase, 404 if not found or unpublished.
  // TODO (Phase 4+): quantity selector + add-to-cart, disabled/hidden when sold out.
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm text-neutral-500">Product detail for &quot;{slug}&quot; coming soon.</p>
    </div>
  );
}
