import Link from "next/link";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/cart", label: "Cart" },
];

export default function Header() {
  return (
    <header className="border-b border-black bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          On Demand Originals
        </Link>
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
