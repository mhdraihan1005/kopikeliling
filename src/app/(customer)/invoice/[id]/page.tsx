"use client";

import { useEffect, useState } from "react";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface Order {
  id: number;
  total_price: number;
  status: string;
  items: OrderItem[];
  created_at: string;
  user_id: number;
}

export default function InvoicePage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/orders/${params.id}`);
        if (!res.ok) throw new Error("Pesanan tidak ditemukan");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Struk Tidak Ditemukan</h1>
        <Link href="/riwayat" className="text-amber-500 hover:underline">Kembali ke Riwayat</Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-900 py-10 font-mono">
      
      {/* Tombol Aksi - Disembunyikan saat diprint */}
      <div className="max-w-md mx-auto mb-6 flex justify-between px-4 print:hidden">
        <Link href="/riwayat" className="text-white hover:text-amber-400 flex items-center gap-2 text-sm font-sans transition-colors">
          <ArrowLeft size={16} /> Kembali
        </Link>
        <button 
          onClick={handlePrint}
          className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm font-sans transition-colors shadow-lg"
        >
          <Printer size={16} /> Cetak Struk
        </button>
      </div>

      {/* Kertas Struk Thermal */}
      <div className="bg-white text-black max-w-md mx-auto w-full p-8 shadow-2xl print:shadow-none print:p-0 print:m-0">
        
        {/* Header Toko */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1 tracking-widest">E-COFFEE</h1>
          <p className="text-sm font-bold uppercase tracking-widest border-y border-black py-1 mb-2 inline-block">Keliling</p>
          <p className="text-xs text-gray-600">Politeknik Negeri Batam, Batam Centre</p>
          <p className="text-xs text-gray-600">Telp: 0896-6846-8181</p>
        </div>

        {/* Info Transaksi */}
        <div className="text-xs mb-6 border-t border-dashed border-gray-400 pt-4">
          <div className="flex justify-between mb-1">
            <span>TANGGAL:</span>
            <span>{new Date(order.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>ORDER ID:</span>
            <span>#{order.id.toString().padStart(6, '0')}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>KASIR:</span>
            <span>SISTEM DIGITAL</span>
          </div>
        </div>

        {/* List Barang */}
        <div className="border-t border-dashed border-gray-400 pt-4 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-dashed border-gray-400">
                <th className="text-left font-normal pb-2">ITEM</th>
                <th className="text-center font-normal pb-2">QTY</th>
                <th className="text-right font-normal pb-2">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2 pr-2">
                    <span className="font-bold block">{item.name}</span>
                    <span className="text-gray-500 text-[10px]">@ {item.price.toLocaleString()}</span>
                  </td>
                  <td className="py-2 text-center align-top">{item.qty}</td>
                  <td className="py-2 text-right align-top items-end font-bold">
                    {(item.price * item.qty).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ringkasan Biaya */}
        <div className="border-t border-dashed border-gray-400 pt-4 mb-8 text-sm">
          <div className="flex justify-between mb-1">
            <span>Subtotal</span>
            <span>Rp {order.total_price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Pajak (Termasuk)</span>
            <span>Rp 0</span>
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-black text-lg font-bold">
            <span>TOTAL YADG</span>
            <span>Rp {order.total_price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-600">
            <span>Metode Bayar</span>
            <span>MIDTRANS PAYMENT GATEWAY</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Status</span>
            <span className="font-bold text-black uppercase">{order.status}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs mt-8">
          <p className="mb-1">TERIMA KASIH ATAS KUNJUNGAN ANDA</p>
          <p className="mb-6">Kritik & Saran: care@ecoffeekeliling.com</p>
          
          <div className="w-full flex justify-center opacity-80">
            {/* Barcode Dummy SVG */}
            <svg width="200" height="40" viewBox="0 0 200 40" fill="black" xmlns="http://www.w3.org/2000/svg">
               <rect x="10" y="0" width="4" height="40"/>
               <rect x="18" y="0" width="2" height="40"/>
               <rect x="25" y="0" width="6" height="40"/>
               <rect x="35" y="0" width="4" height="40"/>
               <rect x="42" y="0" width="1" height="40"/>
               <rect x="48" y="0" width="8" height="40"/>
               <rect x="62" y="0" width="2" height="40"/>
               <rect x="68" y="0" width="5" height="40"/>
               <rect x="76" y="0" width="3" height="40"/>
               <rect x="83" y="0" width="6" height="40"/>
               <rect x="94" y="0" width="2" height="40"/>
               <rect x="102" y="0" width="8" height="40"/>
               <rect x="114" y="0" width="4" height="40"/>
               <rect x="122" y="0" width="2" height="40"/>
               <rect x="128" y="0" width="6" height="40"/>
               <rect x="138" y="0" width="1" height="40"/>
               <rect x="144" y="0" width="4" height="40"/>
               <rect x="152" y="0" width="3" height="40"/>
               <rect x="158" y="0" width="7" height="40"/>
               <rect x="170" y="0" width="2" height="40"/>
               <rect x="178" y="0" width="5" height="40"/>
               <rect x="188" y="0" width="4" height="40"/>
            </svg>
          </div>
          <p className="mt-2 text-[10px] tracking-[0.2em]">{order.id.toString().padStart(6, '0')}-{new Date(order.created_at).getTime()}</p>
        </div>
        
      </div>
      
    </div>
  );
}
