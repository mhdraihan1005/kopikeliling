"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Coffee, LayoutDashboard, ShoppingBag, List, FileBarChart, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Pesanan Masuk", href: "/admin/orders", icon: <ShoppingBag size={20} /> },
    { name: "Manajemen Menu", href: "/admin/menu", icon: <List size={20} /> },
    { name: "Laporan", href: "/admin/reports", icon: <FileBarChart size={20} /> },
    { name: "Pengaturan", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="hidden md:flex w-64 bg-white/40 backdrop-blur-md border-r border-white/60 flex-col py-8 z-40 shadow-sm">
      <nav className="flex flex-col gap-2 px-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 border ${
                isActive
                  ? "bg-white/80 text-amber-600 border-white shadow-sm"
                  : "text-neutral-500 border-transparent hover:bg-white/60 hover:text-neutral-800"
              }`}
            >
              {link.icon}
              <span className="text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
