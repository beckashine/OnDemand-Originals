"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About Us" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-8">
      {NAV_LINKS.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative pb-1 text-[17px] ${
              active
                ? "font-bold text-brand-black after:absolute after:inset-x-0 after:-bottom-1 after:h-[3px] after:rounded after:bg-brand-navy"
                : "font-medium text-neutral-700 hover:text-brand-navy"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
