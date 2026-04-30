"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Coffee, LayoutDashboard, ShoppingBag, List, FileBarChart, LogOut, Settings, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Pesanan Masuk", href: "/admin/orders", icon: <ShoppingBag size={20} /> },
    { name: "Manajemen Menu", href: "/admin/menu", icon: <List size={20} /> },
    { name: "Manajemen User", href: "/admin/users", icon: <Users size={20} /> },
    { name: "Laporan", href: "/admin/reports", icon: <FileBarChart size={20} /> },
    { name: "Pengaturan", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className={`hidden md:flex transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'} bg-zinc-900/80 backdrop-blur-md border-r border-zinc-800 flex-col py-6 z-40 shadow-2xl relative`}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-amber-600 text-white rounded-full p-1 shadow-lg border border-amber-500 hover:bg-amber-700 transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className={`px-6 mb-8 flex flex-col gap-1 transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden m-0 p-0' : 'opacity-100'}`}>
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Admin Panel</h2>
        <p className="text-sm text-zinc-400">Kelola operasional Anda</p>
      </div>
      <nav className="flex flex-col gap-2 px-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-300 ${
                isActive
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? link.name : undefined}
            >
              <div className="flex-shrink-0">{link.icon}</div>
              {!isCollapsed && <span className="text-sm whitespace-nowrap">{link.name}</span>}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto px-4">
         <button
            onClick={handleLogout}
            title={isCollapsed ? "Keluar" : undefined}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-rose-500 font-bold bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all ${isCollapsed ? 'px-0' : ''}`}
         >
            <div className="flex-shrink-0"><LogOut size={18} /></div>
            {!isCollapsed && <span>Keluar</span>}
         </button>
      </div>
    </aside>
  );
}
