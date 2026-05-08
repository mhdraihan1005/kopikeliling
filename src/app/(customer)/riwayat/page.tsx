"use client";

import { useState, useEffect } from "react";
import CustomerNavbar from "@/components/CustomerNavbar";
import Footer from "@/components/Footer";
import { ReceiptText, Clock, CheckCircle2, XCircle, ArrowUpRight, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  payment_status: string;
  items: OrderItem[];
  created_at: string;
  reviews?: any[];
}

export default function RiwayatPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviewModal, setReviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{orderId: number, product: OrderItem} | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleOpenReview = (orderId: number, product: OrderItem) => {
    setSelectedItem({ orderId, product });
    setRating(5);
    setComment("");
    setReviewModal(true);
  };

  const submitReview = async () => {
    if (!selectedItem) return;
    setSubmittingReview(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedItem.orderId,
          product_id: selectedItem.product.id,
          rating,
          comment
        })
      });
      if (res.ok) {
        alert("Thank you for your review!");
        setReviewModal(false);
        // Update local state to hide the button immediately
        setOrders(prev => prev.map(o => {
          if (o.id === selectedItem.orderId) {
            return {
              ...o,
              reviews: [...(o.reviews || []), { product_id: selectedItem.product.id }]
            };
          }
          return o;
        }));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to send review.");
      }
    } catch (e) {
      alert("An error occurred.");
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setLoading(false);
          return;
        }
        const currentUser = JSON.parse(userStr);
        
        const res = await fetch(`http://127.0.0.1:8000/api/orders?user_id=${currentUser.id}`);
        if (!res.ok) throw new Error("Failed to fetch history");
        
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-sm font-medium">
            <CheckCircle2 size={14} /> Completed
          </span>
        );
      case 'Diproses':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm font-medium">
            <Clock size={14} /> Processing
          </span>
        );
      case 'Pending':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-sm font-medium">
            <Clock size={14} /> Pending
          </span>
        );
      case 'Dibatalkan':
      case 'Gagal':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-sm font-medium">
            <XCircle size={14} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-neutral-800 text-neutral-400 border border-neutral-700 rounded-full text-sm font-medium">
            Unknown Status
          </span>
        );
    }
  };

  const getPaymentBadge = (payment_status: string) => {
    switch (payment_status) {
      case 'Paid':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-sm font-medium">
            <CheckCircle2 size={14} /> Paid
          </span>
        );
      case 'Pending':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-sm font-medium">
            <Clock size={14} /> Unpaid
          </span>
        );
      case 'Failed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-sm font-medium">
            <XCircle size={14} /> Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-neutral-800 text-neutral-400 border border-neutral-700 rounded-full text-sm font-medium">
            Unpaid
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-amber-500/30">
      <CustomerNavbar />

      <main className="flex-1 relative w-full">


        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
          
          {/* Simple Page Header */}
          <div className="border-b border-white/10 pb-6 mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 tracking-tight">
                <ReceiptText className="text-amber-500" size={24} />
                Order History List
              </h1>
              <p className="text-white/50 text-sm">
                Manage and monitor all your previous coffee purchases.
              </p>
            </div>
          </div>

          {/* List Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mb-4"></div>
              <p className="text-sm">Loading order data...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col items-center shadow-2xl">
              <ReceiptText className="text-white/20 mb-4" size={48} />
              <h2 className="text-xl font-bold text-white mb-2">No Transactions Yet</h2>
              <p className="text-white/50 mb-6 max-w-sm">
                It seems you haven't made any orders yet. 
              </p>
              <a href="/menu" className="text-sm px-6 py-2.5 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
                Order Coffee
              </a>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div key={order.id} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 shadow-xl group">
                  
                  {/* Header Information List */}
                  <div className="px-5 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                      <div>
                        <p className="text-xs text-white/40 mb-1">Transaction Date</p>
                        <p className="text-sm text-white/90 font-medium whitespace-nowrap">
                          {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1">Total Spending</p>
                        <p className="text-sm text-amber-400 font-bold whitespace-nowrap">
                          Rp {order.total_price.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1">Payment Status</p>
                        {getPaymentBadge(order.payment_status)}
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1">Order Status</p>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center sm:justify-end text-white/40">
                      {order.status === 'Selesai' && (
                        <a href={`/invoice/${order.id}`} target="_blank" className="text-xs mr-4 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors flex items-center gap-1.5">
                          <ReceiptText size={14} /> Print Receipt
                        </a>
                      )}
                      <span className="text-xs font-mono font-medium tracking-wider">#{order.id.toString().padStart(6, '0')}</span>
                    </div>
                  </div>
                  
                  {/* Order Item Detailed List */}
                  <div className="px-5 py-4">
                    <ul className="divide-y divide-white/5">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-neutral-800 to-black text-amber-500 border border-white/5 rounded-lg flex items-center justify-center font-bold text-lg shadow-inner">
                              {item.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-white/90">{item.name}</span>
                              <span className="text-xs text-white/50"><span className="text-amber-500/70 font-bold">{item.qty} items</span> x Rp {item.price.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-sm font-bold text-white/80">
                              Rp {(item.qty * item.price).toLocaleString()}
                            </div>
                            {order.status === 'Selesai' && (!order.reviews || !order.reviews.some(r => r.product_id === item.id)) && (
                              <button 
                                onClick={() => handleOpenReview(order.id, item)}
                                className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-full hover:bg-amber-500 hover:text-black transition-colors"
                              >
                                Review Product
                              </button>
                            )}
                            {order.reviews && order.reviews.some(r => r.product_id === item.id) && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 bg-white/5 text-white/40 border border-white/10 rounded-full">
                                Reviewed
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Review Modal */}
      {reviewModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Write a Review</h2>
            <p className="text-white/60 text-sm mb-6">How was the taste of <span className="text-amber-500 font-bold">{selectedItem.product.name}</span>?</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star 
                    size={36} 
                    className={star <= rating ? "text-amber-500 fill-amber-500" : "text-white/20"} 
                  />
                </button>
              ))}
            </div>

            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience (optional)..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 outline-none focus:border-amber-500 transition-colors resize-none h-24 mb-6"
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setReviewModal(false)}
                className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitReview}
                disabled={submittingReview}
                className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                {submittingReview ? "Sending..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}