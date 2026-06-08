"use client";

import { useState, useEffect } from "react";
import { Star, Trash2, MessageSquare } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  product: {
    id: number;
    name: string;
    images: { image_url: string }[];
  };
  order: {
    id: number;
    user: {
      name: string;
    } | null;
    guest_name?: string | null;
  };
}

export default function AdminReviewsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/reviews");
      const data = await res.json();
      setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(r => 
    r.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (r.order?.user?.name && r.order.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.order?.guest_name && r.order.guest_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.comment && r.comment.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reviews/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '/kopi1.png';
    if (url.startsWith('/storage/')) {
      const host = typeof window !== 'undefined' 
        ? (window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname) 
        : '127.0.0.1';
      return `http://${host}:8000${url}`;
    }
    if (!url.startsWith('http') && !url.startsWith('/')) return `/${url}`;
    return url;
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
           <div className="bg-amber-600/20 p-2.5 rounded-2xl">
              <MessageSquare className="text-amber-500" size={28} />
           </div>
           <div>
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">Customer Reviews</h1>
              <p className="text-zinc-500 text-sm mt-2">Monitor and manage ratings and feedback from your customers.</p>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24 bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/5">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
          <Star size={56} className="mx-auto text-zinc-800 mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">No Reviews Found</h3>
          <p className="text-zinc-500 max-w-xs mx-auto">
            {searchQuery ? `No results matching "${searchQuery}"` : "You haven't received any reviews yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReviews.map(review => (
            <div key={review.id} className="group bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col hover:border-amber-500/30 transition-all duration-300 shadow-xl">
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-zinc-800 overflow-hidden flex-shrink-0 border border-white/10">
                    <img 
                      src={review.product?.images && review.product.images.length > 0 ? getImageUrl(review.product.images[0].image_url) : "/kopi1.png"} 
                      alt={review.product?.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-bold tracking-tight text-lg leading-none mb-1.5">{review.product?.name}</h3>
                     <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-amber-500 border border-white/5">
                           {(review.order?.user?.name || review.order?.guest_name || 'G').charAt(0)}
                        </div>
                        <p className="text-xs text-zinc-500">By <span className="text-zinc-300 font-medium">{review.order?.user?.name || review.order?.guest_name || 'Guest'}</span></p>
                     </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(review.id)}
                  className="text-zinc-600 hover:text-rose-500 transition-all p-2 rounded-xl hover:bg-rose-500/10"
                  title="Delete Review"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex items-center gap-1.5 mb-5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={14} 
                    className={star <= review.rating ? "text-amber-500 fill-amber-500" : "text-zinc-800"} 
                  />
                ))}
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-3 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>

              <div className="flex-1 bg-white/[0.03] rounded-xl p-5 border border-white/5 relative overflow-hidden group-hover:bg-white/[0.05] transition-colors">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                   <MessageSquare size={40} className="text-zinc-500" />
                </div>
                {review.comment ? (
                  <p className="text-sm text-zinc-300 italic relative z-10">&quot;{review.comment}&quot;</p>
                ) : (
                  <p className="text-xs text-zinc-600 italic relative z-10">(No comment provided)</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
