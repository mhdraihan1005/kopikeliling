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

  const StatSquare = ({ title, value, icon }: any) => (
    <div className="bg-white/50 backdrop-blur-md border border-white/60 shadow-sm rounded-xl p-6 flex flex-col items-center justify-center text-center aspect-auto sm:aspect-square hover:bg-white/70 transition-all duration-300 group">
      <div className="text-neutral-600 mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      {loading ? (
        <div className="h-8 w-20 bg-neutral-200/50 animate-pulse rounded-lg mb-2"></div>
      ) : (
        <h3 className="text-3xl font-black text-neutral-800 mb-2 truncate w-full">{value}</h3>
      )}
      <p className="text-sm font-medium text-neutral-600">{title}</p>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      
      {/* Halo Greeting Banner */}
      <div className="bg-white/50 backdrop-blur-md border border-white/60 shadow-sm rounded-2xl p-8 mb-6 text-center text-neutral-600 font-medium">
        Halo. Selamat datang di halaman admin
      </div>

      {/* Square Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <StatSquare 
          title="Total Penjualan" 
          value={`Rp ${(stats.totalRevenue / 1000).toLocaleString()}K`} 
          icon={<DollarSign size={40} />}
        />
        <StatSquare 
          title="Total Menu" 
          value={stats.totalProducts.toString()} 
          icon={<Package size={40} />}
        />
        <StatSquare 
          title="Semua Pesanan" 
          value={stats.totalOrders.toString()} 
          icon={<ShoppingBag size={40} />}
        />
        <StatSquare 
          title="Pesanan Tertunda" 
          value={stats.pendingOrders.toString()} 
          icon={<Clock size={40} />}
        />
        <StatSquare 
          title="Pelanggan Aktif" 
          value={<Users size={28} className="mx-auto" />} // Mock feature for grid layout balance
          icon={<Users size={40} className="text-neutral-400" />}
        />
        <div 
          onClick={() => window.location.href='/admin/orders'}
          className="bg-white/30 backdrop-blur-md border border-white/60 shadow-sm rounded-xl p-6 flex flex-col items-center justify-center text-center aspect-auto sm:aspect-square hover:bg-amber-500/20 hover:text-amber-700 cursor-pointer transition-all duration-300 text-neutral-500"
        >
          <TrendingUp size={40} className="mb-4" />
          <p className="font-bold">Lihat Semua Transaksi</p>
        </div>
      </div>

    </div>
  );
}
