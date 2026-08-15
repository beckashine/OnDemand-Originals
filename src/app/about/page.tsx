export const metadata = {
  title: "About Us | On Demand Originals",
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-16 px-4 py-12">
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">About On Demand Originals</h1>
        <p className="text-sm text-neutral-500">
          {/* TODO: replace with approved About copy once provided by client */}
          Placeholder — final About copy coming soon.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-brand-navy">Our Story</h2>
        <p className="text-sm text-neutral-500">
          {/* TODO: replace with the client's actual business story/history */}
          Business story copy pending.
        </p>
      </section>

      <section className="flex flex-col gap-4 border-t border-brand-black pt-12">
        <h2 className="text-xl font-semibold text-brand-navy">Authentication &amp; Sourcing</h2>
        <p className="text-sm text-neutral-500">
          {/* TODO: replace with the client's actual authentication process (e.g. PSA/JSA,
              certificate of authenticity) and how one-of-a-kind pieces are sourced */}
          Every piece we sell is one-of-a-kind. Details on our authentication process and
          sourcing practices coming soon.
        </p>
      </section>
    </div>
  );
}
