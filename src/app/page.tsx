import Link from "next/link";
import NewsletterForm from "@/components/newsletter/NewsletterForm";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12">
      {/* Hero */}
      <section className="flex flex-col items-start gap-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Authentic Sports Memorabilia
        </h1>
        <p className="max-w-xl text-neutral-600">
          {/* TODO: replace with approved copy once provided by client */}
          One-of-a-kind and limited pieces, sourced and sold directly.
        </p>
        <Link
          href="/products"
          className="rounded bg-brand-navy px-5 py-2.5 text-sm font-medium text-brand-white hover:opacity-90"
        >
          Shop the Collection
        </Link>
      </section>

      {/* New Arrivals */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">New Arrivals</h2>
        <p className="text-sm text-neutral-500">
          {/* TODO: render latest published products here (Phase 3+) */}
          Product grid coming soon.
        </p>
      </section>

      {/* Featured */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Featured Memorabilia</h2>
        <p className="text-sm text-neutral-500">
          {/* TODO: render featured products here (Phase 3+) */}
          Product grid coming soon.
        </p>
      </section>

      {/* About */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">About Us</h2>
        <p className="max-w-2xl text-sm text-neutral-600">
          {/* TODO: replace with approved About copy once provided by client */}
          About section copy pending.
        </p>
      </section>

      {/* Newsletter */}
      <section className="flex flex-col gap-4 border-t border-brand-black pt-12">
        <h2 className="text-xl font-semibold">Stay Up to Date</h2>
        <p className="text-sm text-neutral-600">
          Get notified when new memorabilia is added to the collection.
        </p>
        <NewsletterForm />
      </section>
    </div>
  );
}
