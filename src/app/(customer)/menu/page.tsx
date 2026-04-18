"use client";

import { Coffee, Star, Clock, DollarSign, CupSoda, Flame, CheckCircle2, Search } from "lucide-react";
import { useState, useEffect } from "react";
import CustomerNavbar from "@/components/CustomerNavbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  prepTime: string;
  category: string;
}

async function fetchMenuItems(): Promise<MenuItem[]> {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/products');
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari server');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default function MenuPage() {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await fetchMenuItems();
        setMenuData(data);
      } catch (error) {
        console.error('Failed to load menu:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, []);

  const filteredMenu = menuData.filter((item) => {
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-black selection:bg-amber-500/30">
      <CustomerNavbar />

      <main className="flex-1 relative">
        {/* Background Overlay Retained */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat fixed"
          style={{ backgroundImage: "url('/Barista.png')" }}
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[4px]" />

        {/* Konten Utama */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-24">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Eksplorasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Sajian Kopi</span> Kami
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Temukan profil rasa favorit Anda dari kurasi biji kopi pilihan.
              Setiap cangkir diracik presisi oleh barista profesional.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="relative w-16 h-16">
                <Spinner className="absolute inset-0 text-amber-500 animate-spin" />
              </div>
              <p className="text-white/70 font-medium tracking-wider animate-pulse">Menyeduh data menu...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-10 pb-16">

              {/* Pencarian */}
              <div className="max-w-xl mx-auto w-full relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search size={20} className="text-white/40 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Cari kopi, seperti 'Cold Brew' atau 'Latte'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 focus:border-amber-500 rounded-full py-4 pl-14 pr-6 text-white placeholder:text-white/40 outline-none backdrop-blur-md focus:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:bg-white/10 transition-all duration-300"
                />
              </div>
              
              {/* Category Filter Pills */}
              <div className="flex justify-center gap-3 flex-wrap">
                {["Semua", "Hot Coffee", "Cold Coffee", "Specialty"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                      selectedCategory === category
                        ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                        : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMenu.map((item) => (
                  <div 
                    key={item.id} 
                    className="group rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl hover:bg-black/60 hover:border-white/20 transition-all duration-500 flex flex-col overflow-hidden shadow-2xl"
                  >
                    {/* Visual Card Top */}
                    <div className="relative w-full h-52 bg-gradient-to-b from-neutral-800 to-black flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600 via-transparent to-transparent"></div>
                      
                      {item.category === "Hot Coffee" ? <Flame size={56} className="text-amber-500/80 drop-shadow-lg z-10 group-hover:scale-110 transition-transform duration-500" />
                        : item.category === "Cold Coffee" ? <CupSoda size={56} className="text-amber-500/80 drop-shadow-lg z-10 group-hover:scale-110 transition-transform duration-500" />
                        : <Coffee size={56} className="text-amber-500/80 drop-shadow-lg z-10 group-hover:scale-110 transition-transform duration-500" />
                      }
                      
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                         <Star size={12} className="text-amber-400 fill-amber-400" />
                         <span className="text-white text-xs font-bold">{item.rating}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                         <Clock size={12} className="text-white/80" />
                         <span className="text-white/80 text-xs font-medium">{item.prepTime}</span>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex flex-col flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">{item.name}</h3>
                        <span className="px-2.5 py-0.5 border border-amber-500/30 text-amber-500 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10">
                          {item.category}
                        </span>
                      </div>
                      
                      <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">{item.description}</p>
                      
                      <div className="flex justify-between items-end pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-white/40 text-xs font-medium mb-1">Harga</span>
                          <span className="text-2xl font-black text-amber-500 drop-shadow-sm">
                            Rp {item.price.toLocaleString()}
                          </span>
                        </div>
                        <button 
                          onClick={() => addToCart(item)} 
                          className="px-6 py-2.5 bg-white text-black hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95 rounded-xl font-bold transition-all"
                        >
                          Pesan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Informational Section */}
              <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Komitmen Layanan Kami</h3>
                  <p className="text-white/60">Kami memastikan kualitas premium di setiap tahap pemrosesan kopi Anda.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 text-white/80">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-amber-500" />
                    <span className="font-medium text-sm">Biji Kopi Terkurasi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-amber-500" />
                    <span className="font-medium text-sm">Barista Tersertifikasi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-amber-500" />
                    <span className="font-medium text-sm">Pelayanan Tepat Waktu</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Spinner(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}