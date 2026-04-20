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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-zinc-200/80 bg-[#333333] shadow-sm dark:border-zinc-800 relative z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">

        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-white">
          <Coffee size={20} className="text-white" />
          <span className="tracking-tight hidden sm:block">E-Coffee Keliling</span>
          <span className="tracking-tight sm:hidden">E-Coffee</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2 text-sm">
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
            <Link href="/login" className="ml-2 px-4 py-1.5 rounded-lg font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors">
              Login
            </Link>
          )}
        </div>

        {/* Mobile & Cart Buttons */}
        <div className="flex items-center gap-3">
          {/* Cart Icon (Always Visible) */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-white hover:text-zinc-300 transition-colors"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold animate-pulse">
                {totalItems}
              </span>
            )}
          </button>

          {/* Hamburger Menu (Mobile Only) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white md:hidden hover:bg-zinc-700/50 rounded-lg transition-colors"
          >
            <div className="space-y-1.5 w-5">
              <div className={`h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-700 bg-[#333333] px-4 py-3 pb-6 flex flex-col gap-3 shadow-xl absolute w-full left-0 z-40">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-lg px-4 py-2.5 font-medium transition-all ${
                  isActive
                    ? "bg-amber-500/10 text-amber-500"
                    : "text-zinc-300 hover:bg-zinc-700/50 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="h-px w-full bg-zinc-700 my-1 font-bold"></div>
          
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="px-4 py-2 text-white">
                <div className="font-medium text-sm">Masuk sebagai: {user.name}</div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="rounded-lg px-4 py-2.5 text-left font-medium text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-4 py-2.5 font-bold text-black bg-amber-500 text-center transition-all mt-2"
            >
              Login / Daftar
            </Link>
          )}
        </div>
      )}

      {/* Render Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {showUserMenu && (
        <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
      )}
    </nav>
  );
}