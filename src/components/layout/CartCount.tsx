"use client";

import { useCart } from "@/context/CartContext";

export default function CartCount() {
  const { itemCount } = useCart();
  if (itemCount === 0) return null;
  return (
    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-yellow px-1 text-[11px] font-bold text-brand-black">
      {itemCount}
    </span>
  );
}
