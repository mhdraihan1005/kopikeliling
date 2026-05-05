"use client";

import { useState, useEffect } from "react";
import { Star, Trash2 } from "lucide-react";

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
    }
  };
}

export default function AdminReviewsPage() {
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

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) return;
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
    if (url.startsWith('/storage/')) return `http://127.0.0.1:8000${url}`;
    if (!url.startsWith('http') && !url.startsWith('/')) return `/${url}`;
    return url;
  };

  return (
    <div className="bg-[#111] p-6 rounded-3xl border border-[#333] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Ulasan Pelanggan</h1>
          <p className="text-gray-400 mt-1">Pantau dan kelola rating serta komentar dari pembeli.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-[#1a1a1a] rounded-2xl border border-[#222]">
          <Star size={48} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/50 text-lg">Belum ada ulasan dari pelanggan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-5 flex flex-col hover:border-amber-500/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#222] overflow-hidden flex-shrink-0">
                    <img 
                      src={review.product?.images && review.product.images.length > 0 ? getImageUrl(review.product.images[0].image_url) : "/kopi1.png"} 
                      alt={review.product?.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{review.product?.name}</h3>
                    <p className="text-xs text-gray-500">Oleh: <span className="text-amber-400">{review.order?.user?.name}</span></p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(review.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                  title="Hapus Ulasan"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={16} 
                    className={star <= review.rating ? "text-amber-500 fill-amber-500" : "text-white/20"} 
                  />
                ))}
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>

              <div className="flex-1 bg-[#222] rounded-xl p-4">
                {review.comment ? (
                  <p className="text-sm text-gray-300 italic">"{review.comment}"</p>
                ) : (
                  <p className="text-sm text-gray-600 italic">(Tidak ada komentar)</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
