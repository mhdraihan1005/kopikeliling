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
    <nav className="bg-[#424242] text-white shadow-md z-50">
      <div className="w-full flex items-center justify-between px-6 py-4">
        
        {/* Left: Brand Icon */}
        <div className="flex items-center gap-3">
          <Coffee size={32} strokeWidth={1.5} className="text-white" />
          <span className="text-xl font-bold tracking-wide">E-Coffee Keliling</span>
        </div>

        {/* Right: User */}
        <div className="flex items-center gap-6">

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:text-gray-300 transition-colors font-bold text-sm"
              >
                <User size={18} />
                <span>{user.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl py-1 z-50 text-neutral-800">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-sm">{user.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
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
