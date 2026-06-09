"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag, RefreshCw, Eye, Search, Play, Check, X, Lock } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterToday, setFilterToday] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      } else {
        alert("Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toString().includes(searchQuery) || 
      o.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.payment_status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.user?.name && o.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.guest_name && o.guest_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.fulfillment_type && o.fulfillment_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.table_number && o.table_number.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterToday) {
      const orderDate = new Date(o.created_at).toDateString();
      const todayDate = new Date().toDateString();
      return orderDate === todayDate;
    }

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-500/10 text-green-500 border-green-500/30";
      case "Pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      case "Processing": return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "Cancelled":
      case "Failed": return "bg-red-500/10 text-red-500 border-red-500/30";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      case "Pending": return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "Failed": return "bg-rose-500/10 text-rose-500 border-rose-500/30";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const renderOrderActions = (order: any) => {
    const status = order.status;
    
    switch (status) {
      case "Pending":
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleUpdateStatus(order.id, "Processing")}
              className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl px-3 py-2.5 flex items-center gap-1.5 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
            >
              <Play size={10} fill="currentColor" strokeWidth={3} />
              Start Brewing
            </button>
            <button
              onClick={() => handleUpdateStatus(order.id, "Cancelled")}
              title="Cancel Order"
              className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 hover:border-transparent p-2.5 rounded-xl active:scale-95 transition-all"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </div>
        );
      case "Processing":
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleUpdateStatus(order.id, "Completed")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl px-3 py-2.5 flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <Check size={10} strokeWidth={3} />
              Complete
            </button>
            <button
              onClick={() => handleUpdateStatus(order.id, "Cancelled")}
              title="Cancel Order"
              className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 hover:border-transparent p-2.5 rounded-xl active:scale-95 transition-all"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </div>
        );
      case "Completed":
      case "Cancelled":
      case "Failed":
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <div className="bg-amber-600/20 p-2 rounded-xl">
            <ShoppingBag className="text-amber-500" size={32} />
          </div>
          Incoming Orders
        </h1>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Today vs All Filter Toggle */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => setFilterToday(true)}
              className={`px-4 py-2 rounded-lg transition-all ${filterToday ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-white'}`}
            >
              Today Only
            </button>
            <button
              onClick={() => setFilterToday(false)}
              className={`px-4 py-2 rounded-lg transition-all ${!filterToday ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-white'}`}
            >
              All Orders
            </button>
          </div>

          <button 
            onClick={fetchOrders}
            disabled={loading}
            className="bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all border border-white/10 text-xs"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Data
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500 font-medium animate-pulse">Fetching orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] text-zinc-500 text-[11px] uppercase tracking-widest border-b border-white/5">
                  <th className="p-5 font-black">Order ID</th>
                  <th className="p-5 font-black">Customer</th>
                  <th className="p-5 font-black">Date</th>
                  <th className="p-5 font-black">Service</th>
                  <th className="p-5 font-black">Amount</th>
                  <th className="p-5 font-black">Payment</th>
                  <th className="p-5 font-black">Status</th>
                  <th className="p-5 font-black text-center">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => {
                  const date = new Date(order.created_at);
                  const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-5 font-bold text-white group-hover:text-amber-500 transition-colors">
                        #ORD-{order.id.toString().padStart(4, '0')}
                      </td>
                      <td className="p-5 text-white text-sm">
                        {order.user?.name ? (
                          <div className="flex flex-col">
                            <span className="font-semibold">{order.user.name}</span>
                            <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">Member</span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-semibold">{order.guest_name || 'Guest'}</span>
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Guest</span>
                          </div>
                        )}
                      </td>
                      <td className="p-5 text-zinc-500 text-sm">
                        {formattedDate}
                      </td>
                      <td className="p-5 text-zinc-300 text-sm">
                        <div className="flex flex-col">
                          <span className="font-bold text-amber-500 text-xs uppercase tracking-wider">
                            {order.fulfillment_type || 'Dine In'}
                          </span>
                          {order.fulfillment_type !== 'Pickup' && order.table_number && (
                            <span className="text-[10px] text-zinc-400">
                              Table {order.table_number}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 font-bold text-amber-500">
                        Rp {Number(order.total_price).toLocaleString()}
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getPaymentStatusColor(order.payment_status || 'Pending')}`}>
                          {order.payment_status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        {renderOrderActions(order)}
                      </td>
                    </tr>
                  );
                })}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-zinc-500 italic">No orders found matching your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
