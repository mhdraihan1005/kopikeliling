"use client";

import React, { useEffect, useState } from "react";
import { FileBarChart, Calendar, DollarSign, ShoppingBag, Download, Printer, Filter, ChevronDown, Package, Users } from "lucide-react";

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("all"); // all, today, week, month
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  
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
    .filter(o => o.status === 'Completed' || o.payment_status === 'Paid')
    .reduce((acc, o) => acc + Number(o.total_price), 0);
    
  const totalOrders = filteredOrders.length;
  
  const successfulOrders = filteredOrders.filter(o => o.status === 'Completed' || o.payment_status === 'Paid').length;
  
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

  const getChartData = () => {
    const revenueMap: { [key: string]: number } = {};
    const labels: string[] = [];

    const getDayName = (date: Date) => {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    };
    
    const getMonthName = (date: Date) => {
      return date.toLocaleDateString("en-US", { month: "short" });
    };

    if (filterDate === "today") {
      const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
      hours.forEach(h => {
        revenueMap[h] = 0;
        labels.push(h);
      });

      filteredOrders.forEach(o => {
        if (o.status === 'Completed' || o.payment_status === 'Paid') {
          const date = new Date(o.created_at);
          const hour = date.getHours();
          let slot = "08:00";
          if (hour >= 22) slot = "22:00";
          else if (hour >= 20) slot = "20:00";
          else if (hour >= 18) slot = "18:00";
          else if (hour >= 16) slot = "16:00";
          else if (hour >= 14) slot = "14:00";
          else if (hour >= 12) slot = "12:00";
          else if (hour >= 10) slot = "10:00";
          
          revenueMap[slot] += Number(o.total_price);
        }
      });
    } else if (filterDate === "week") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayLabel = getDayName(d);
        revenueMap[dayLabel] = 0;
        labels.push(dayLabel);
      }

      filteredOrders.forEach(o => {
        if (o.status === 'Completed' || o.payment_status === 'Paid') {
          const dayLabel = getDayName(new Date(o.created_at));
          if (revenueMap[dayLabel] !== undefined) {
            revenueMap[dayLabel] += Number(o.total_price);
          }
        }
      });
    } else if (filterDate === "month") {
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
      weeks.forEach(w => {
        revenueMap[w] = 0;
        labels.push(w);
      });

      filteredOrders.forEach(o => {
        if (o.status === 'Completed' || o.payment_status === 'Paid') {
          const date = new Date(o.created_at);
          const dayOfMonth = date.getDate();
          let slot = "Week 1";
          if (dayOfMonth > 28) slot = "Week 5";
          else if (dayOfMonth > 21) slot = "Week 4";
          else if (dayOfMonth > 14) slot = "Week 3";
          else if (dayOfMonth > 7) slot = "Week 2";

          revenueMap[slot] += Number(o.total_price);
        }
      });
    } else {
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthLabel = getMonthName(d);
        revenueMap[monthLabel] = 0;
        labels.push(monthLabel);
      }

      filteredOrders.forEach(o => {
        if (o.status === 'Completed' || o.payment_status === 'Paid') {
          const monthLabel = getMonthName(new Date(o.created_at));
          if (revenueMap[monthLabel] !== undefined) {
            revenueMap[monthLabel] += Number(o.total_price);
          }
        }
      });
    }

    return labels.map(label => ({
      label,
      value: revenueMap[label] || 0
    }));
  };

  const renderChart = () => {
    const data = getChartData();
    const maxVal = Math.max(...data.map(d => d.value));
    const roundedMax = maxVal === 0 ? 100000 : Math.ceil(maxVal / 10000) * 10000;
    
    const height = 180;
    const width = 600;
    const paddingLeft = 55;
    const paddingBottom = 30;
    const paddingTop = 20;
    const paddingRight = 20;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    
    const points = data.map((d, i) => {
      const x = paddingLeft + (i * chartWidth / (data.length - 1));
      const y = paddingTop + chartHeight - (d.value * chartHeight / roundedMax);
      return { x, y, label: d.label, value: d.value };
    });
    
    let linePath = "";
    if (points.length > 0) {
      linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
    }
    
    let areaPath = "";
    if (points.length > 0) {
      areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;
    }
    
    return (
      <div className="relative w-full h-full">
        <div className="absolute top-0 right-4 flex items-center gap-1.5 bg-zinc-800/80 border border-white/5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-zinc-400 backdrop-blur-md">
          {hoveredPoint !== null ? (
            <>
              <span className="text-amber-500">{points[hoveredPoint].label}:</span>
              <span className="text-white">Rp {points[hoveredPoint].value.toLocaleString('en-US')}</span>
            </>
          ) : (
            <span>Hover point for details</span>
          )}
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.00" />
            </linearGradient>
            
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.3" />
            </filter>
          </defs>
          
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + (chartHeight * ratio);
            const val = roundedMax * (1 - ratio);
            return (
              <g key={idx}>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  className="stroke-white/5" 
                  strokeDasharray="4 4"
                />
                <text 
                  x={paddingLeft - 10} 
                  y={y + 3} 
                  className="fill-zinc-500 text-[9px] font-bold text-right"
                  textAnchor="end"
                >
                  {val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}
                </text>
              </g>
            );
          })}
          
          {areaPath && (
            <path d={areaPath} fill="url(#areaGradient)" />
          )}
          
          {linePath && (
            <path 
              d={linePath} 
              fill="none" 
              stroke="#f59e0b" 
              strokeWidth="2.5" 
              filter="url(#glow)"
            />
          )}
          
          {points.map((p, idx) => (
            <g 
              key={idx}
              onMouseEnter={() => setHoveredPoint(idx)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="cursor-pointer"
            >
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="12" 
                className="fill-transparent"
              />
              
              <circle 
                cx={p.x} 
                cy={p.y} 
                r={hoveredPoint === idx ? "5.5" : "4"} 
                className="fill-zinc-950 stroke-amber-500 stroke-[2] transition-all duration-200"
              />
              
              {hoveredPoint === idx && (
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="10" 
                  className="fill-amber-500/20 stroke-transparent animate-ping"
                />
              )}
              
              {hoveredPoint === idx && (
                <line 
                  x1={p.x} 
                  y1={paddingTop} 
                  x2={p.x} 
                  y2={paddingTop + chartHeight} 
                  className="stroke-amber-500/20" 
                  strokeDasharray="2 2"
                />
              )}
            </g>
          ))}
          
          {points.map((p, idx) => (
            <text 
              key={idx}
              x={p.x} 
              y={height - 10} 
              className={`text-[9px] font-bold transition-all text-center ${hoveredPoint === idx ? 'fill-white' : 'fill-zinc-500'}`}
              textAnchor="middle"
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    );
  };

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
            Sales Report
          </h1>
          <p className="text-zinc-400 mt-2">Analyze your KopiKuy business performance.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <select 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-800 text-white pl-10 pr-10 py-2.5 rounded-xl font-bold outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
            </select>
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          </div>
          
          <button 
            onClick={handlePrint}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all border border-zinc-700"
          >
            <Printer size={18} /> Print Report
          </button>
        </div>
      </div>

      {/* Stats Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-6 rounded-3xl shadow-xl shadow-amber-900/20 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
            <DollarSign size={120} />
          </div>
          <p className="text-amber-100 font-bold mb-1 opacity-80">Total Revenue</p>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Rp {totalRevenue.toLocaleString('en-US')}
          </h2>
          <div className="mt-4 flex items-center gap-2 text-amber-100 text-sm">
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold">Live Data</span>
            <span>Based on selected filter</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-zinc-800 opacity-50 transform group-hover:scale-110 transition-transform duration-500">
            <ShoppingBag size={120} />
          </div>
          <p className="text-zinc-400 font-bold mb-1">Total Transactions</p>
          <h2 className="text-4xl font-black text-white tracking-tight">
            {totalOrders}
          </h2>
          <p className="mt-4 text-zinc-500 text-sm font-medium">
            <span className="text-emerald-500 font-bold">{successfulOrders}</span> Success / <span className="text-rose-500 font-bold">{totalOrders - successfulOrders}</span> Failed or Pending
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-zinc-800 opacity-50 transform group-hover:scale-110 transition-transform duration-500">
            <Users size={120} />
          </div>
          <p className="text-zinc-400 font-bold mb-1">Average Per Transaction</p>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Rp {totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString('en-US') : 0}
          </h2>
          <p className="mt-4 text-zinc-500 text-sm font-medium italic">
            Sales effectiveness per customer
          </p>
        </div>
      </div>

      {/* Sales Trend Chart Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-lg p-6 overflow-hidden no-print">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <FileBarChart size={20} className="text-amber-500" />
          Revenue Trend Chart
        </h3>
        <div className="w-full h-64 sm:h-72">
          {renderChart()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Best Sellers */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Package size={20} className="text-amber-500" /> Best Selling Products
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
                    <p className="text-xs text-zinc-500">{item.count} Sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-amber-500">Rp {item.total.toLocaleString('en-US')}</p>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Total Value</p>
                </div>
              </div>
            )) : (
              <div className="py-12 text-center text-zinc-500">No sales data yet.</div>
            )}
          </div>
        </div>

        {/* Transaction History Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Filter size={20} className="text-amber-500" /> Recent Transaction Details
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-900/30 text-zinc-500 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredOrders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-white">#ORD-{order.id.toString().padStart(4, '0')}</td>
                    <td className="px-6 py-4 text-xs font-black text-amber-500">Rp {Number(order.total_price).toLocaleString('en-US')}</td>
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
              <div className="py-12 text-center text-zinc-500">No transactions found.</div>
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
