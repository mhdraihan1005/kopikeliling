"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Users, ShoppingBag, DollarSign, Package, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/orders"),
          fetch("http://127.0.0.1:8000/api/products"),
        ]);
        
        const ordersData = ordersRes.ok ? await ordersRes.json() : [];
        const productsData = productsRes.ok ? await productsRes.json() : [];

        const revenue = ordersData.filter((o: any) => o.status === 'Selesai').reduce((acc: number, o: any) => acc + o.total_price, 0);
        const pending = ordersData.filter((o: any) => o.status === 'Pending').length;

        setStats({
          totalRevenue: revenue,
          totalOrders: ordersData.length,
          totalProducts: productsData.length,
          pendingOrders: pending,
        });

        setRecentOrders(ordersData.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const StatSquare = ({ title, value, icon, trend }: any) => (
    <div className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-md shadow-lg rounded-2xl p-6 flex flex-col hover:bg-zinc-800 hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute -right-6 -top-6 text-zinc-800/50 transform group-hover:scale-110 group-hover:text-amber-500/10 transition-all duration-500">
        {React.cloneElement(icon, { size: 120 })}
      </div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-zinc-800/80 rounded-xl text-amber-500 border border-zinc-700/50 shadow-inner group-hover:bg-amber-500 group-hover:text-zinc-900 transition-colors duration-300">
          {icon}
        </div>
        {trend && (
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
            {trend}
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-sm font-semibold text-zinc-400 mb-1">{title}</p>
        {loading ? (
          <div className="h-8 w-24 bg-zinc-800 animate-pulse rounded-lg"></div>
        ) : (
          <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto py-6 space-y-6">
      
      {/* Halo Greeting Banner */}
      <div className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-md shadow-lg rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 text-white border border-amber-400/30">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Selamat datang, Admin!</h2>
            <p className="text-zinc-400 mt-1">Berikut adalah ringkasan performa E-Coffee Keliling hari ini.</p>
          </div>
        </div>
        <div className="relative z-10 hidden sm:flex gap-3">
          <button onClick={() => window.location.href='/admin/orders'} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-600/20 transition-all border border-amber-500/50">
            Lihat Pesanan
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatSquare 
          title="Total Pendapatan" 
          value={`Rp ${(stats.totalRevenue / 1000).toLocaleString()}K`} 
          icon={<DollarSign size={24} />}
          trend="+12%"
        />
        <StatSquare 
          title="Total Pesanan" 
          value={stats.totalOrders.toString()} 
          icon={<ShoppingBag size={24} />}
          trend="+5%"
        />
        <StatSquare 
          title="Total Menu Aktif" 
          value={stats.totalProducts.toString()} 
          icon={<Package size={24} />}
        />
        <StatSquare 
          title="Pesanan Menunggu" 
          value={stats.pendingOrders.toString()} 
          icon={<Clock size={24} />}
        />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock size={18} className="text-amber-500" /> Transaksi Terbaru
          </h3>
          <button onClick={() => window.location.href='/admin/orders'} className="text-sm font-semibold text-amber-500 hover:text-amber-400 transition-colors">
            Lihat Semua &rarr;
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-zinc-500 text-xs uppercase tracking-wider bg-zinc-900/30">
                <th className="px-6 py-4 font-semibold">ID Pesanan</th>
                <th className="px-6 py-4 font-semibold">Tanggal</th>
                <th className="px-6 py-4 font-semibold">Total Harga</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 animate-pulse">Memuat data pesanan terbaru...</td>
                </tr>
              ) : recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-white group-hover:text-amber-400 transition-colors">
                        #ORD-{order.id.toString().padStart(4, '0')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-amber-500">
                      Rp {Number(order.total_price).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        order.status === 'Selesai' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                        order.status === 'Diproses' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        order.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">Belum ada pesanan masuk.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
