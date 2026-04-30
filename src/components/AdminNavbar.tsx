"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Coffee, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/admin" },
    { name: "Pesanan", href: "/admin/orders" },
    { name: "Menu", href: "/admin/menu" },
    { name: "Laporan", href: "/admin/reports" },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 text-white shadow-sm relative z-50">
      <div className="w-full flex items-center justify-between px-6 py-4">
        
        {/* Left: Brand Icon */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-600 p-2 rounded-xl shadow-lg shadow-amber-600/20">
            <Coffee size={24} strokeWidth={2} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">E-Coffee Keliling</span>
        </div>

        {/* Right: User */}
        <div className="flex items-center gap-6">

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:text-amber-500 transition-colors font-bold text-sm bg-zinc-800/80 px-4 py-2 rounded-full border border-zinc-700 hover:border-zinc-600"
              >
                <div className="bg-zinc-700/80 p-1.5 rounded-full text-zinc-300">
                  <User size={16} />
                </div>
                <span>{user.name}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-zinc-900 rounded-xl shadow-2xl py-1 z-50 text-white border border-zinc-800 backdrop-blur-xl">
                  <div className="px-4 py-3 border-b border-zinc-800/50">
                    <p className="font-bold text-sm text-amber-500">{user.name}</p>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-rose-500 hover:bg-zinc-800/80 flex items-center gap-2 font-medium transition-colors"
                  >
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="font-bold text-sm flex items-center gap-2">
              <User size={18} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
