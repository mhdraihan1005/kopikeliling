"use client";

import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function CartSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { cart, updateQty, removeFromCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalItems = cart.reduce((acc: number, item: any) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc: number, item: any) => acc + (item.price * item.qty), 0);

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        toast.error("Anda harus login untuk melakukan pesanan!");
        setIsCheckingOut(false);
        return;
      }
      
      const user = JSON.parse(userStr);
      const orderPayload = {
        user_id: parseInt(user.id),
        total_price: totalPrice,
        items: cart,
      };

      const res = await fetch("http://127.0.0.1:8000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) throw new Error("Checkout failed");

      const data = await res.json();

      if (data.snap_token) {
        // @ts-ignore
        window.snap.pay(data.snap_token, {
          onSuccess: async function (result: any) {
            try {
              await fetch(`http://127.0.0.1:8000/api/orders/${data.order.id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ payment_status: 'Paid', status: 'Diproses' }),
              });
            } catch (e) {
              console.error('Failed to update status', e);
            }
            toast.success("Pembayaran Berhasil! Pesanan sedang diproses.");
            cart.forEach((item: any) => removeFromCart(item.id));
            setTimeout(() => {
              window.location.href = '/riwayat';
            }, 1000);
          },
          onPending: function (result: any) {
            toast.success("Menunggu pembayaran Anda!");
            cart.forEach((item: any) => removeFromCart(item.id));
            setTimeout(() => {
              window.location.href = '/riwayat';
            }, 1000);
          },
          onError: function (result: any) {
            toast.error("Pembayaran Gagal!");
            setIsCheckingOut(false);
          },
          onClose: function () {
            toast.error("Anda belum menyelesaikan pembayaran");
            setIsCheckingOut(false);
            cart.forEach((item: any) => removeFromCart(item.id)); // also empty since order already created in DB
            setTimeout(() => {
              window.location.href = '/riwayat';
            }, 1000);
          }
        });
      } else {
        toast.success("Checkout Berhasil! Pesanan sedang diproses.");
        setTimeout(() => {
          window.location.href = '/riwayat';
        }, 1000);
      }

    } catch (err) {
      toast.error("Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Keranjang Saya
            <span className="bg-amber-100 text-amber-600 text-xs py-0.5 px-2 rounded-full">
              {totalItems} item
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                <Trash2 size={40} className="text-gray-300" />
              </div>
              <p className="text-lg font-medium">Keranjang masih kosong</p>
              <button onClick={onClose} className="mt-2 text-amber-600 hover:underline">
                Ayo pesan kopi sekarang!
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item: any) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{item.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-amber-600 font-bold text-sm">Rp {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-2 py-1 shadow-sm">
                        <button onClick={() => updateQty(item.id, -1)} className="text-gray-400 hover:text-amber-600"><Minus size={14}/></button>
                        <span className="text-sm font-bold w-4 text-center text-gray-700">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="text-gray-400 hover:text-amber-600"><Plus size={14}/></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline ml-auto font-medium">
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-medium">Total Pembayaran</span>
              <span className="text-2xl font-black text-gray-800">Rp {totalPrice.toLocaleString()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {isCheckingOut ? "Memproses..." : "Lanjut ke Pembayaran"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
