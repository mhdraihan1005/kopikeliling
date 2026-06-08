"use client";

import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState<"Dine In" | "Pickup">("Dine In");
  const [tableNumber, setTableNumber] = useState("");
  const [guestName, setGuestName] = useState("");

  const totalItems = cart.reduce((acc: number, item: any) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc: number, item: any) => acc + (item.price * item.qty), 0);

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);

      // Guest Name validation
      if (!user && !guestName.trim()) {
        toast.error("Please enter your name!");
        setIsCheckingOut(false);
        return;
      }

      // Table Number validation for Dine In
      if (fulfillmentType === "Dine In" && !tableNumber.trim()) {
        toast.error("Please enter your table number!");
        setIsCheckingOut(false);
        return;
      }
      
      const orderPayload = {
        user_id: user ? parseInt(user.id) : null,
        total_price: totalPrice,
        items: cart,
        fulfillment_type: fulfillmentType,
        table_number: fulfillmentType === "Dine In" ? tableNumber : null,
        guest_name: user ? null : guestName,
      };

      const res = await fetch("http://127.0.0.1:8000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) throw new Error("Checkout failed");

      const data = await res.json();
      
      const redirectUrl = user ? '/riwayat' : `/invoice/${data.order.id}`;

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
            toast.success("Payment Successful! Order is being processed.");
            cart.forEach((item: any) => removeFromCart(item.id));
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 1000);
          },
          onPending: function (result: any) {
            toast.success("Waiting for your payment!");
            cart.forEach((item: any) => removeFromCart(item.id));
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 1000);
          },
          onError: function (result: any) {
            toast.error("Payment Failed!");
            setIsCheckingOut(false);
          },
          onClose: function () {
            toast.error("You have not completed the payment");
            setIsCheckingOut(false);
            cart.forEach((item: any) => removeFromCart(item.id)); // also empty since order already created in DB
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 1000);
          }
        });
      } else {
        toast.success("Checkout Successful! Order is being processed.");
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
      }

    } catch (err) {
      toast.error("An error occurred while processing the order.");
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
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] bg-zinc-950/95 backdrop-blur-xl border-l border-white/5 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            My Cart
            <span className="bg-amber-500 text-black text-[10px] font-black py-0.5 px-2 rounded-full uppercase tracking-wider">
              {totalItems} items
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
              <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5">
                <Trash2 size={40} className="text-zinc-700" />
              </div>
              <p className="text-lg font-medium text-zinc-500">Cart is empty</p>
              <button onClick={onClose} className="mt-2 text-amber-500 hover:text-amber-400 font-bold tracking-tight">
                Let&apos;s order some coffee now!
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item: any) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex-shrink-0 flex items-center justify-center shadow-lg shadow-amber-900/20 group-hover:scale-105 transition-transform">
                    <span className="text-white font-black text-lg">{item.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white tracking-tight leading-none">{item.name}</h3>
                      <p className="text-amber-500 font-black text-sm mt-1">Rp {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-3 bg-white/5 rounded-lg border border-white/5 px-2 py-1 shadow-inner">
                        <button onClick={() => updateQty(item.id, -1)} className="text-zinc-500 hover:text-amber-500 transition-colors"><Minus size={14}/></button>
                        <span className="text-sm font-bold w-4 text-center text-white">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="text-zinc-500 hover:text-amber-500 transition-colors"><Plus size={14}/></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-rose-500 hover:text-rose-400 ml-auto font-bold uppercase tracking-tighter">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-white/[0.02] space-y-4">
            {/* Fulfillment and Table/Guest details selection */}
            <div className="space-y-4 border-b border-white/5 pb-4">
              <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setFulfillmentType("Dine In")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    fulfillmentType === "Dine In"
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/10"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Dine In
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillmentType("Pickup")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    fulfillmentType === "Pickup"
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/10"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Pickup
                </button>
              </div>

              {!user && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nama Pemesan</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Masukkan nama Anda..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              )}

              {fulfillmentType === "Dine In" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nomor Meja</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Masukkan nomor meja (misal: 5)..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-5">
              <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Total Payment</span>
              <span className="text-2xl font-black text-white">Rp {totalPrice.toLocaleString()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-xl shadow-amber-900/40 transition-all hover:-translate-y-1 active:translate-y-0"
            >
              {isCheckingOut ? "Processing..." : "Continue to Payment"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
