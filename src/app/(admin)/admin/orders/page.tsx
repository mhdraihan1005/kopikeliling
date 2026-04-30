"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag, RefreshCw, Eye } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        // Update local state without fetching again for faster UI update
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      } else {
        alert("Gagal mengupdate status pesanan.");
      }
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai": return "bg-green-500/10 text-green-500 border-green-500/30";
      case "Pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      case "Diproses": return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "Dibatalkan":
      case "Gagal": return "bg-red-500/10 text-red-500 border-red-500/30";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-500/10 text-green-500 border-green-500/30";
      case "Pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      case "Failed": return "bg-red-500/10 text-red-500 border-red-500/30";
      case "Unpaid": return "bg-gray-500/10 text-gray-500 border-gray-500/30";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <div className="bg-amber-600/20 p-2 rounded-xl">
            <ShoppingBag className="text-amber-500" size={32} />
          </div>
          Pesanan Masuk
        </h1>
        <button 
          onClick={fetchOrders}
          disabled={loading}
          className="bg-[#2d2d2d] hover:bg-[#333333] text-gray-300 hover:text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all border border-[#3a3a3a]"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="bg-[#2d2d2d] border border-[#3a3a3a] shadow-2xl rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium animate-pulse">Memuat data pesanan...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-gray-400 text-sm uppercase tracking-wider border-b border-[#3a3a3a]">
                  <th className="p-4 font-bold">ID Pesanan</th>
                  <th className="p-4 font-bold">Tanggal</th>
                  <th className="p-4 font-bold">Total Harga</th>
                  <th className="p-4 font-bold">Pembayaran</th>
                  <th className="p-4 font-bold">Status Pesanan</th>
                  <th className="p-4 font-bold text-center">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a3a3a]">
                {orders.map((order) => {
                  const date = new Date(order.created_at);
                  const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <tr key={order.id} className="hover:bg-[#333333] transition-colors group">
                      <td className="p-4 font-bold text-white group-hover:text-amber-400 transition-colors">
                        #ORD-{order.id.toString().padStart(4, '0')}
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {formattedDate}
                      </td>
                      <td className="p-4 font-bold text-amber-500">
                        Rp {Number(order.total_price).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPaymentStatusColor(order.payment_status || 'Unpaid')}`}>
                          {order.payment_status || 'Unpaid'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                           <select 
                             value={order.status}
                             onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                             className="bg-[#1a1a1a] text-gray-300 text-sm rounded-lg px-2 py-1.5 border border-[#3a3a3a] outline-none focus:border-amber-500 transition-colors"
                           >
                             <option value="Pending">Pending</option>
                             <option value="Diproses">Diproses</option>
                             <option value="Selesai">Selesai</option>
                             <option value="Dibatalkan">Dibatalkan</option>
                           </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">Belum ada pesanan masuk.</td>
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
