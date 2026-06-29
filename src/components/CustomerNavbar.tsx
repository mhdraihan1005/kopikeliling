"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, ShoppingCart, User, LogOut, ChevronDown, Bell, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
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

  // Polling for completed orders to show notifications
  const [seenCompletedIds, setSeenCompletedIds] = useState<number[]>([]);
  const seenCompletedIdsRef = useRef<number[]>([]);
  const toastedOrderIdsRef = useRef<number[]>([]);
  const isFirstFetch = useRef(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Load seen completed order IDs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("seen_completed_orders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSeenCompletedIds(parsed);
        seenCompletedIdsRef.current = parsed;
      } catch (e) {
        console.error("Failed to parse seen_completed_orders", e);
      }
    }
  }, []);

  const checkCompletedOrders = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/orders?user_id=${user.id}`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const orders = await res.json();
        const completedOrders = orders.filter((o: any) => o.status === "Completed" || o.status === "Selesai");
        
        if (isFirstFetch.current) {
          // First fetch: initialize toasted list with all current completed orders
          toastedOrderIdsRef.current = completedOrders.map((o: any) => o.id);
          isFirstFetch.current = false;
        } else {
          // Subsequent fetches: check if there's any new completed order
          let hasNewCompleted = false;
          completedOrders.forEach((order: any) => {
            if (!toastedOrderIdsRef.current.includes(order.id)) {
              toastedOrderIdsRef.current.push(order.id);
              hasNewCompleted = true;
              toast.success(`Order #ORD-${order.id.toString().padStart(4, '0')} has been completed! Please enjoy your coffee.`, {
                icon: '☕',
                duration: 8000,
              });
            }
          });
          
          if (hasNewCompleted) {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(e => console.log("Audio play failed", e));
          }
        }

        // Filter notifications (completed orders not yet seen by the user)
        const unseenOrders = completedOrders.filter(
          (o: any) => !seenCompletedIdsRef.current.includes(o.id)
        );
        setNotifications(unseenOrders);
      }
    } catch (error) {
      console.error("Failed to fetch order status notifications", error);
    }
  };

  useEffect(() => {
    if (user) {
      checkCompletedOrders();
      const interval = setInterval(checkCompletedOrders, 15000); // Poll every 15 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsSeen = (id: number) => {
    const updatedSeen = [...seenCompletedIds, id];
    setSeenCompletedIds(updatedSeen);
    seenCompletedIdsRef.current = updatedSeen;
    localStorage.setItem("seen_completed_orders", JSON.stringify(updatedSeen));
    
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsSeen = () => {
    const allIds = notifications.map(n => n.id);
    const updatedSeen = [...seenCompletedIds, ...allIds];
    setSeenCompletedIds(updatedSeen);
    seenCompletedIdsRef.current = updatedSeen;
    localStorage.setItem("seen_completed_orders", JSON.stringify(updatedSeen));
    
    setNotifications([]);
  };

  const totalItems = cart.reduce((acc: number, item: any) => acc + (item.qty || 1), 0);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    toast.success("Successfully logged out!");
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    ...(user ? [{ name: "My Orders", href: "/riwayat" }] : []),
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-zinc-200/80 bg-[#333333] shadow-sm dark:border-zinc-800 relative z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          <img src="/logo.png" alt="Kopi Kuy Logo" className="h-14 w-auto object-contain" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-2 px-0.5 font-bold tracking-wide transition-all duration-300 group"
              >
                <span className={isActive ? "text-amber-500" : "text-zinc-300 group-hover:text-white transition-colors duration-300"}>
                  {link.name}
                </span>
                <span className={`absolute bottom-0 left-0 h-[2px] bg-amber-500 transition-all duration-300 ${
                  isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-60"
                }`} />
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
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 py-2 z-50 overflow-hidden">
                  <div className="px-4 py-3 text-sm text-white border-b border-white/5 bg-white/[0.02]">
                    <div className="font-bold tracking-tight">{user.name}</div>
                    <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">{user.role}</div>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 transition-colors font-medium"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
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
          {/* Notification Bell (Only if user is logged in) */}
          {user && (
            <div className="relative">
              <button 
                onClick={() => { setShowNotifMenu(!showNotifMenu); setShowUserMenu(false); }}
                className={`relative p-2 rounded-xl transition-all ${showNotifMenu ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-300 hover:text-white hover:bg-zinc-700/50'}`}
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-black text-[9px] font-black flex items-center justify-center rounded-full border border-[#333333]">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-3 w-80 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-2xl">
                  <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="font-bold text-sm text-white">Notifications</h3>
                    {notifications.length > 0 && (
                      <button 
                        onClick={markAllAsSeen}
                        className="text-[10px] text-amber-500 hover:text-amber-400 font-bold uppercase tracking-wider transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => { 
                            markAsSeen(notif.id);
                            router.push('/riwayat'); 
                            setShowNotifMenu(false); 
                          }}
                          className="px-5 py-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-start gap-4">
                             <div className="bg-amber-500/10 p-2 rounded-lg group-hover:bg-amber-500 group-hover:text-black transition-all">
                                <Coffee size={16} className="text-amber-500 group-hover:text-black" />
                             </div>
                             <div className="flex-1">
                                <p className="text-xs text-white font-bold leading-none mb-1">Order #ORD-{notif.id.toString().padStart(4, '0')} Completed</p>
                                <p className="text-[10px] text-zinc-500 line-clamp-1">Total: Rp {Number(notif.total_price).toLocaleString()}</p>
                                <div className="flex items-center gap-1.5 mt-2 text-[9px] text-zinc-600 font-bold uppercase">
                                   <Clock size={10} /> Completed
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
                    href="/riwayat" 
                    onClick={() => setShowNotifMenu(false)}
                    className="block text-center py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                  >
                    View Order History
                  </Link>
                </div>
              )}
            </div>
          )}

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
                <div className="font-medium text-sm">Logged in as: {user.name}</div>
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
              Login / Register
            </Link>
          )}
        </div>
      )}

      {/* Render Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {(showUserMenu || showNotifMenu) && (
        <div className="fixed inset-0 z-30" onClick={() => { setShowUserMenu(false); setShowNotifMenu(false); }} />
      )}
    </nav>
  );
}