import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/cart", label: "Cart" },
];

export default function Header() {
  return (
    <header className="border-b border-brand-black bg-brand-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" aria-label="On Demand Originals home">
          <Image src="/logo.JPEG" alt="On Demand Originals" width={56} height={56} priority />
        </Link>
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-black hover:text-brand-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
