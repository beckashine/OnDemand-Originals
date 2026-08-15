import Link from "next/link";
import { SPORTS, type Sport } from "@/types/product";

export default function SportFilterNav({ activeSport }: { activeSport?: Sport }) {
  return (
    <nav className="flex shrink-0 flex-row gap-4 overflow-x-auto border-b border-brand-black pb-4 md:w-40 md:flex-col md:gap-3 md:overflow-visible md:border-b-0 md:border-r md:pb-0 md:pr-6">
      <Link
        href="/products"
        className={`whitespace-nowrap text-sm font-medium uppercase tracking-wide ${
          !activeSport ? "text-brand-navy" : "text-brand-black hover:text-brand-navy"
        }`}
      >
        All
      </Link>
      {SPORTS.map((sport) => (
        <Link
          key={sport}
          href={`/products?sport=${sport}`}
          className={`whitespace-nowrap text-sm font-medium uppercase tracking-wide ${
            activeSport === sport ? "text-brand-navy" : "text-brand-black hover:text-brand-navy"
          }`}
        >
          {sport}
        </Link>
      ))}
    </nav>
  );
}
