"use client";

import React, { useEffect, useState } from "react";
import { FileBarChart, Calendar, DollarSign, ShoppingBag, Download, Printer, Filter, ChevronDown, Package, Users } from "lucide-react";

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("all"); // all, today, week, month
  
  const fetchOrders = async () => {
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

  // Filtering Logic
  const filteredOrders = orders.filter(order => {
    if (filterDate === "all") return true;
    
    const orderDate = new Date(order.created_at);
    const now = new Date();
    
    if (filterDate === "today") {
      return orderDate.toDateString() === now.toDateString();
    }
    
    if (filterDate === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return orderDate >= weekAgo;
    }
    
    if (filterDate === "month") {
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }
    
    return true;
  });

  const totalRevenue = filteredOrders
    .filter(o => o.status === 'Selesai' || o.payment_status === 'Paid')
    .reduce((acc, o) => acc + Number(o.total_price), 0);
    
  const totalOrders = filteredOrders.length;
  
  const successfulOrders = filteredOrders.filter(o => o.status === 'Selesai' || o.payment_status === 'Paid').length;
  
  // Calculate best selling items
  const itemCounts: { [key: string]: { name: string, count: number, total: number } } = {};
  filteredOrders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        const id = item.id;
        if (!itemCounts[id]) {
          itemCounts[id] = { name: item.name, count: 0, total: 0 };
        }
        itemCounts[id].count += Number(item.quantity || 1);
        itemCounts[id].total += Number(item.price || 0) * Number(item.quantity || 1);
      });
    }
  });
  
  const bestSellers = Object.values(itemCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-8 no-print">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <div className="bg-amber-600/20 p-2 rounded-xl">
              <FileBarChart className="text-amber-500" size={32} />
            </div>
            Laporan Penjualan
          </h1>
          <p className="text-zinc-400 mt-2">Analisis performa bisnis KopiKuy Anda.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <select 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-800 text-white pl-10 pr-10 py-2.5 rounded-xl font-bold outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
            >
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">Bulan Ini</option>
            </select>
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          </div>
          
          <button 
            onClick={handlePrint}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all border border-zinc-700"
          >
            <Printer size={18} /> Cetak Laporan
          </button>
        </div>
      </div>

      {/* Stats Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-6 rounded-3xl shadow-xl shadow-amber-900/20 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
            <DollarSign size={120} />
          </div>
          <p className="text-amber-100 font-bold mb-1 opacity-80">Total Pendapatan</p>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </h2>
          <div className="mt-4 flex items-center gap-2 text-amber-100 text-sm">
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold">Live Data</span>
            <span>Berdasarkan filter terpilih</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-zinc-800 opacity-50 transform group-hover:scale-110 transition-transform duration-500">
            <ShoppingBag size={120} />
          </div>
          <p className="text-zinc-400 font-bold mb-1">Jumlah Transaksi</p>
          <h2 className="text-4xl font-black text-white tracking-tight">
            {totalOrders}
          </h2>
          <p className="mt-4 text-zinc-500 text-sm font-medium">
            <span className="text-emerald-500 font-bold">{successfulOrders}</span> Berhasil / <span className="text-rose-500 font-bold">{totalOrders - successfulOrders}</span> Gagal atau Pending
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-zinc-800 opacity-50 transform group-hover:scale-110 transition-transform duration-500">
            <Users size={120} />
          </div>
          <p className="text-zinc-400 font-bold mb-1">Rata-rata Per Transaksi</p>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Rp {totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString('id-ID') : 0}
          </h2>
          <p className="mt-4 text-zinc-500 text-sm font-medium italic">
            Efektivitas penjualan per pelanggan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Best Sellers */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Package size={20} className="text-amber-500" /> Produk Terlaris
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {bestSellers.length > 0 ? bestSellers.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 hover:bg-zinc-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-600/20 rounded-xl flex items-center justify-center font-black text-amber-500">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-xs text-zinc-500">{item.count} Terjual</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-amber-500">Rp {item.total.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Total Nilai</p>
                </div>
              </div>
            )) : (
              <div className="py-12 text-center text-zinc-500">Belum ada data penjualan.</div>
            )}
          </div>
        </div>

        {/* Transaction History Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Filter size={20} className="text-amber-500" /> Rincian Transaksi Terbaru
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-900/30 text-zinc-500 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nilai</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredOrders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-white">#ORD-{order.id.toString().padStart(4, '0')}</td>
                    <td className="px-6 py-4 text-xs font-black text-amber-500">Rp {Number(order.total_price).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        order.payment_status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="py-12 text-center text-zinc-500">Tidak ada transaksi ditemukan.</div>
            )}
          </div>
        </div>
      </div>

      {/* Printing Styles */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .bg-zinc-900, .bg-zinc-800, .bg-zinc-800/50 { background: white !important; border: 1px solid #eee !important; color: black !important; }
          .text-white, .text-zinc-400, .text-zinc-500, .text-amber-100 { color: black !important; }
          .bg-gradient-to-br { background: white !important; color: black !important; border: 2px solid black !important; }
          .shadow-xl, .shadow-lg { shadow: none !important; }
          .rounded-3xl, .rounded-2xl { border-radius: 0 !important; }
          h1, h2, h3 { color: black !important; }
        }
      `}</style>
    </div>
  );
}
