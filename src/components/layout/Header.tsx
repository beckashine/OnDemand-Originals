import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/cart", label: "Cart" },
];

export default function Header() {
  return (
    <header className="border-b border-brand-black bg-brand-white">
      <div className="flex flex-col items-center gap-3 px-4 py-6">
        <Link href="/" aria-label="On Demand Originals home">
          <Image
            src="/logo.JPEG"
            alt="On Demand Originals"
            width={120}
            height={120}
            priority
            className="h-24 w-24 sm:h-28 sm:w-28"
          />
        </Link>
        <nav className="flex items-center gap-8 border-t border-brand-black pt-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-brand-black hover:text-brand-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
