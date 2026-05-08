"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Coffee, User, LogOut, ChevronDown, Bell, Search, Command, LayoutGrid, ShoppingBag, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const lastOrderCount = useRef(0);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Fetch new orders as notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/orders");
      if (res.ok) {
        const allOrders = await res.json();
        // Filter for Pending orders (new orders)
        const newOrders = allOrders.filter((o: any) => o.status === "Pending").slice(0, 5);
        setNotifications(newOrders);
        setUnreadCount(newOrders.length);

        // Sound alert & toast if there's a truly NEW order (count increased)
        if (newOrders.length > lastOrderCount.current && lastOrderCount.current !== 0) {
          toast.success("New order received!", {
             icon: '☕',
             duration: 5000,
          });
          // Play a subtle notification sound
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(e => console.log("Audio play failed", e));
        }
        lastOrderCount.current = newOrders.length;
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  // Initial fetch and polling every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    if (pathname.includes('/admin')) {
       router.replace(`${pathname}${query}`);
    }
  }, [searchValue, pathname, router, searchParams]);

  return (
    <nav className="bg-zinc-950/40 backdrop-blur-xl border-b border-white/5 text-white sticky top-0 z-50">
      <div className="w-full flex items-center justify-between px-6 py-3">
        
        {/* Left Section: Brand & Search */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/admin')}>
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-2 rounded-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Coffee size={22} strokeWidth={2.5} className="text-white" />
            </div>
            <div className="flex flex-col">
               <span className="text-lg font-black tracking-tight leading-none">Kopi<span className="text-amber-500">Kuy!</span></span>
               <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Management</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-xl w-80 group focus-within:border-amber-500/50 transition-all">
            <Search size={16} className="text-zinc-500 group-focus-within:text-amber-500" />
            <input 
              type="text" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search across the system..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-600"
            />
            <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-[10px] text-zinc-500">
               <Command size={10} /> K
            </div>
          </div>
        </div>

        {/* Right Section: Actions & User */}
        <div className="flex items-center gap-4">
          
          {/* Notifications Trigger */}
          <div className="relative">
            <button 
              onClick={() => { setShowNotifMenu(!showNotifMenu); setShowUserMenu(false); }}
              className={`relative p-2.5 rounded-xl transition-all ${showNotifMenu ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-amber-500 text-black text-[9px] font-black flex items-center justify-center rounded-full border-2 border-zinc-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-3 w-80 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-2xl">
                <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <h3 className="font-bold text-sm text-white">Notifications</h3>
                  <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded-full font-black uppercase tracking-wider">{unreadCount} New Orders</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => { router.push('/admin/orders'); setShowNotifMenu(false); }}
                        className="px-5 py-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-start gap-4">
                           <div className="bg-amber-500/10 p-2 rounded-lg group-hover:bg-amber-500 group-hover:text-black transition-all">
                              <ShoppingBag size={16} className="text-amber-500 group-hover:text-black" />
                           </div>
                           <div className="flex-1">
                              <p className="text-xs text-white font-bold leading-none mb-1">New Order #ORD-{notif.id.toString().padStart(4, '0')}</p>
                              <p className="text-[10px] text-zinc-500 line-clamp-1">Total: Rp {Number(notif.total_price).toLocaleString()}</p>
                              <div className="flex items-center gap-1.5 mt-2 text-[9px] text-zinc-600 font-bold uppercase">
                                 <Clock size={10} /> Just Now
                              </div>
                           </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center flex flex-col items-center gap-3">
                       <Bell size={32} className="text-zinc-800" />
                       <p className="text-xs text-zinc-500 italic">No new notifications</p>
                    </div>
                  )}
                </div>
                <Link 
                  href="/admin/orders" 
                  onClick={() => setShowNotifMenu(false)}
                  className="block text-center py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  View All Orders
                </Link>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block"></div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifMenu(false); }}
                className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center border border-white/10 shadow-inner">
                  <User size={16} className="text-amber-500" />
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-xs font-bold text-white leading-none">{user.name}</span>
                  <span className="text-[10px] text-zinc-500 uppercase font-black mt-1">Admin</span>
                </div>
                <ChevronDown size={14} className={`text-zinc-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden backdrop-blur-2xl">
                  <div className="px-4 py-3 border-b border-white/5 mb-1 bg-white/[0.02]">
                    <p className="font-bold text-sm text-white">{user.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">{user.email}</p>
                  </div>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 flex items-center gap-3 transition-colors">
                    <User size={16} className="text-zinc-500" /> My Profile
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 flex items-center gap-3 transition-colors">
                    <LayoutGrid size={16} className="text-zinc-500" /> Activity Log
                  </button>
                  <div className="h-px bg-white/5 my-1 mx-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 flex items-center gap-3 font-bold transition-colors"
                  >
                    <LogOut size={16} /> Logout System
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-xl transition-all">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
