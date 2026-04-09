"use client";

import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

export default function Navbar({ cartCount }: any) {
  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-gray-800 text-white">
      
      {/* LOGO */}
      <h1 className="text-xl font-bold">☕ E-Coffee Keliling</h1>

      {/* MENU */}
      <div className="flex items-center gap-6">

        <Link href="/">Beranda</Link>
        <Link href="/menu">Menu</Link>
        <Link href="/riwayat">Riwayat</Link>
        <Link href="#">Kontak</Link>
        <Link href="#">Login</Link>

        {/* CART */}
        <div className="relative text-2xl cursor-pointer">
          <FaShoppingCart />

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </div>

      </div>
    </nav>
  );
}