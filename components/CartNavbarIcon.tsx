"use client";

import { useCartStore } from "@/store/cart";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartNavbarIcon() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors mr-2">
      <ShoppingCart className="w-5 h-5 text-gray-700" />
      {mounted && totalItems > 0 && (
        <span className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
