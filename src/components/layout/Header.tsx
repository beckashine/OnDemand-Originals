import Link from "next/link";
import Image from "next/image";
import CartCount from "./CartCount";
import NavLinks from "./NavLinks";
import SearchForm from "./SearchForm";

function CartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="21" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="21" r="1.4" fill="currentColor" stroke="none" />
      <path d="M1.5 2h3l2.6 12.7a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22.5 6H5.2" />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="border-b border-brand-gray-line bg-brand-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="On Demand Originals home" className="shrink-0">
          <Image
            src="/logo.JPEG"
            alt="On Demand Originals"
            width={200}
            height={200}
            priority
            className="h-[200px] w-[200px]"
          />
        </Link>

        <div className="order-3 w-full sm:order-2 sm:w-auto">
          <NavLinks />
        </div>

        <div className="order-2 ml-auto flex items-center gap-4 sm:order-3 sm:ml-0">
          <SearchForm />
          <Link href="/cart" aria-label="Cart" className="relative flex h-10 w-10 items-center justify-center text-brand-black">
            <CartIcon />
            <CartCount />
          </Link>
        </div>
      </div>
    </header>
  );
}
