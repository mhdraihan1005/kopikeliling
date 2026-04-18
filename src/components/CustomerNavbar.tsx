"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, ShoppingCart, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import CartSidebar from "@/components/CartSidebar";

export default function CustomerNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const totalItems = cart.reduce((acc: number, item: any) => acc + (item.qty || 1), 0);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    toast.success("Berhasil keluar dari akun!");
    router.push("/login");
  };

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Pesanan", href: "/riwayat" },
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
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
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

          <button 
            onClick={() => setIsCartOpen(true)}
            className="ml-4 relative p-2 text-white hover:text-zinc-300 transition-colors"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Render Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}
    </nav>
  );
}