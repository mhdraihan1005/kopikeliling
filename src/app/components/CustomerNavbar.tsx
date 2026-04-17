"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, ShoppingCart, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function CustomerNavbar() {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Sementara hardcode, nanti diganti useAuth
  const user = null; // ganti ke: { name: "Budi", email: "budi@mail.com" } untuk test login state

  const handleLogout = () => {
    // nanti diisi logic logout
  };

  const navLinks = [
    { name: "Beranda", href: "/customer" },
    { name: "Menu", href: "/customer/menu" },
    { name: "Pesanan", href: "/customer/orders" },
    { name: "Promo", href: "/customer/promotions" },
    { name: "Kontak", href: "/customer/contact" },
  ];

  return (
    <nav className="rounded-none border border-zinc-200/80 bg-[#333333] px-6 py-3 shadow-sm dark:border-zinc-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-sm">

        <div className="flex items-center gap-2 font-bold text-white">
          <Coffee size={20} className="text-white" />
          <span className="tracking-tight">E-Coffee Keliling</span>
        </div>

        <div className="flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-1.5 font-medium transition-all ${
                  isActive
                    ? "bg-zinc-500/50 text-white"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {user ? (
            <div className="relative ml-2">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white hover:bg-zinc-700/50 transition-colors"
              >
                <User size={16} />
                <span className="text-sm">{user.name}</span>
                <ChevronDown size={14} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="ml-2 font-bold text-white hover:text-zinc-300">
              Login
            </Link>
          )}

          <button className="ml-4 relative p-2 text-white hover:text-zinc-300 transition-colors">
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              0
            </span>
          </button>
        </div>
      </div>

      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}
    </nav>
  );
}