import Link from "next/link";
import ProductCarousel from "@/components/home/ProductCarousel";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { getPublishedProducts } from "@/lib/products";

export default async function Home() {
  const newArrivals = await getPublishedProducts(undefined, undefined, 10);

  return (
    <div className="flex flex-col">
      {/* New Arrivals carousel */}
      <section aria-label="New arrivals" className="pt-9">
        <p className="font-display mb-4 text-center text-sm tracking-[0.2em] text-neutral-500 uppercase">
          New Arrivals
        </p>
        <ProductCarousel products={newArrivals} />
      </section>

      <div className="mt-9 mb-16 flex justify-center">
        <Link
          href="/products"
          className="rounded-full bg-brand-navy px-10 py-4 text-sm font-extrabold tracking-wide text-brand-white uppercase hover:bg-brand-navy-dark"
        >
          Shop Now
        </Link>
      </div>

      {/* Newsletter */}
      <section className="stripe-overlay border-t-4 border-dashed border-brand-yellow border-b-4 bg-brand-black px-6 py-19 overflow-hidden">
        <div className="relative mx-auto max-w-xl text-center">
          <p className="mb-3.5 text-[16px] font-extrabold tracking-[0.28em] text-brand-yellow uppercase">
            Join the team
          </p>
          <h2 className="font-display text-[40px] tracking-wide text-brand-white uppercase sm:text-[52px]">
            Get In The <span className="text-brand-yellow">Huddle</span>
          </h2>
          <p className="mx-auto mt-4.5 max-w-md text-[20px] text-neutral-300">
            Sign up for early access to new signings, member-only pricing, and first look at
            limited-run frames.
          </p>
          <div className="mt-8">
            <NewsletterForm />
          </div>
          <p className="mt-4 text-[16px] text-neutral-500">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
