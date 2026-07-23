"use client";

import { useEffect, useState, useRef } from "react";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { toast } from "react-hot-toast";

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
  fulfillment_type?: string;
  table_number?: string;
  guest_name?: string;
  payment_status?: string;
  snap_token?: string;
}

export default function InvoicePage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);
  const prevStatusRef = useRef<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setIsGuest(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:8000/api/orders/${params.id}`, {
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        
        if (!active) return;

        // If the status has transitioned to "Completed"
        if (prevStatusRef.current && prevStatusRef.current !== "Completed" && prevStatusRef.current !== "Selesai" && (data.status === "Completed" || data.status === "Selesai")) {
          toast.success("Your order is completed! Please enjoy your coffee.", {
            icon: '☕',
            duration: 8000,
          });
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(e => console.log("Audio play failed", e));
        }

        prevStatusRef.current = data.status;
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 15000); // Poll every 15 seconds

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [params.id]);

  const handlePayNow = () => {
    if (!order || !order.snap_token) return;
    
    // @ts-ignore
    window.snap.pay(order.snap_token, {
      onSuccess: async function (result: any) {
        try {
          const token = localStorage.getItem("token");
          const headers: any = { "Content-Type": "application/json" };
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
          
          await fetch(`http://127.0.0.1:8000/api/orders/${order.id}/status`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({ 
              payment_status: 'Paid', 
              status: 'Processing',
              midtrans_order_id: result.order_id 
            }),
          });
          toast.success("Payment Successful! Order is being processed.");
          // Refresh order status
          const res = await fetch(`http://127.0.0.1:8000/api/orders/${order.id}`, {
            headers: token ? { "Authorization": `Bearer ${token}` } : {}
          });
          if (res.ok) {
            const data = await res.json();
            setOrder(data);
          }
        } catch (e) {
          console.error('Failed to update status', e);
        }
      },
      onPending: function (result: any) {
        toast("Waiting for your payment!", { icon: "⏳" });
      },
      onError: function (result: any) {
        toast.error("Payment Failed!");
      },
      onClose: function () {
        toast.error("You have not completed the payment");
      }
    });
  };

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
        <h1 className="text-2xl font-bold mb-4">Receipt Not Found</h1>
        <Link href={isGuest ? "/" : "/riwayat"} className="text-amber-500 hover:underline">
          Back to {isGuest ? "Home" : "History"}
        </Link>
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
        <Link href={isGuest ? "/" : "/riwayat"} className="text-white hover:text-amber-400 flex items-center gap-2 text-sm font-sans transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>
        <button 
          onClick={handlePrint}
          className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm font-sans transition-colors shadow-lg"
        >
          <Printer size={16} /> Print Receipt
        </button>
      </div>

      {/* Payment Recovery Banner */}
      {order && (order.payment_status === "Unpaid" || order.payment_status === "Pending") && order.status === "Pending" && order.snap_token && (
        <div className="max-w-md mx-auto mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-center text-white print:hidden shadow-2xl">
          <h3 className="font-black text-amber-500 text-sm mb-1.5 uppercase tracking-wider flex items-center justify-center gap-1.5">
            ⚠️ Uncompleted Payment
          </h3>
          <p className="text-xs text-white/70 mb-4 leading-relaxed">
            Please complete your payment so we can start preparing your order!
          </p>
          <button
            onClick={handlePayNow}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-3 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-amber-500/15"
          >
            Pay Now
          </button>
        </div>
      )}

      {/* Kertas Struk Thermal */}
      <div className="bg-white text-black max-w-md mx-auto w-full p-8 shadow-2xl print:shadow-none print:p-0 print:m-0">
        
        {/* Header Toko */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1 tracking-widest">KOPIKUY</h1>
          <p className="text-sm font-bold uppercase tracking-widest border-y border-black py-1 mb-2 inline-block">KopiKuy</p>
          <p className="text-xs text-gray-600">Politeknik Negeri Batam, Batam Centre</p>
          <p className="text-xs text-gray-600">Phone: 0896-6846-8181</p>
        </div>

        {/* Info Transaksi */}
        <div className="text-xs mb-6 border-t border-dashed border-gray-400 pt-4">
          <div className="flex justify-between mb-1">
            <span>DATE:</span>
            <span>{new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>ORDER ID:</span>
            <span>#{order.id.toString().padStart(6, '0')}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>CASHIER:</span>
            <span>DIGITAL SYSTEM</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>SERVICE:</span>
            <span className="font-bold uppercase">{order.fulfillment_type || 'Dine In'}</span>
          </div>
          {order.fulfillment_type === 'Dine In' && order.table_number && (
            <div className="flex justify-between mb-1">
              <span>TABLE:</span>
              <span className="font-bold">{order.table_number}</span>
            </div>
          )}
          {order.guest_name && (
            <div className="flex justify-between mb-1">
              <span>GUEST NAME:</span>
              <span className="font-bold uppercase">{order.guest_name}</span>
            </div>
          )}
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
            <span>Tax (Included)</span>
            <span>Rp 0</span>
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-black text-lg font-bold">
            <span>TOTAL PAID</span>
            <span>Rp {order.total_price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-600">
            <span>Payment Method</span>
            <span>MIDTRANS PAYMENT GATEWAY</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Status</span>
            <span className="font-bold text-black uppercase">
              {order.status === 'Selesai' ? 'COMPLETED' : 
               order.status === 'Diproses' ? 'PROCESSING' : 
               order.status === 'Dibatalkan' ? 'CANCELLED' : 
               order.status === 'Gagal' ? 'FAILED' : 
               order.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs mt-8">
          <p className="mb-1">THANK YOU FOR YOUR VISIT</p>
          <p className="mb-6">Feedback & Suggestions: care@kopikuy.com</p>
          
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
