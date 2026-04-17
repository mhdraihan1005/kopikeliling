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
    <nav className="mb-8 rounded-none border border-zinc-200/80 bg-[#333333] px-6 py-3 shadow-sm dark:border-zinc-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-sm">

        {/* Bagian Kiri: Ikon dan Brand */}
        <div className="flex items-center gap-2 font-bold text-white">
          <Coffee size={20} className="text-white" />
          <span className="tracking-tight">Admin Panel</span>
        </div>

        {/* Bagian Kanan: Menu Navigasi */}
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

          {/* User Menu */}
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
                    <div className="text-xs text-amber-600 font-medium">Role: {user.role}</div>
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
            <Link
              href="/login"
              className="ml-2 font-bold text-white hover:text-zinc-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
}
