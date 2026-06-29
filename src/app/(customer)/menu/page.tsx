"use client";

import { Coffee, Star, Clock, DollarSign, CupSoda, Flame, CheckCircle2, Search } from "lucide-react";
import { useState, useEffect } from "react";
import CustomerNavbar from "@/components/CustomerNavbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useCart } from "@/contexts/CartContext";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  images: any[];
  rating: number;
  prepTime: string;
  category: string;
  stock: number;
}

async function fetchMenuItems(): Promise<MenuItem[]> {
  try {
    const host = typeof window !== 'undefined' 
      ? (window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname) 
      : '127.0.0.1';
    const response = await fetch(`http://${host}:8000/api/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch data from server');
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isShopClosed, setIsShopClosed] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const host = typeof window !== 'undefined' 
          ? (window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname) 
          : '127.0.0.1';
        const res = await fetch(`http://${host}:8000/api/settings`);
        if (res.ok) {
          const data = await res.json();
          setIsShopClosed(data.shop_status === "closed");
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

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
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    <div className="flex flex-col min-h-screen selection:bg-amber-500/30">
      <CustomerNavbar />

      <main className="flex-1 relative">
        <PageTransition variant="slideUp">
          {/* Main Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-24">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Coffee Selection</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Find your favorite flavor profile from our curated coffee beans.
              Every cup is precisely crafted by professional baristas.
            </p>

            {isShopClosed && (
              <div className="p-5 bg-gradient-to-r from-rose-950/40 to-red-950/40 border border-rose-500/20 rounded-3xl text-center max-w-2xl mx-auto shadow-xl shadow-rose-950/10 backdrop-blur-md animate-pulse">
                <h3 className="text-rose-400 font-black text-lg mb-1">Our Shop is Currently Closed</h3>
                <p className="text-rose-200/70 text-xs">
                  We are currently not accepting new orders. You can still browse our menu, and we will be back soon!
                </p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="relative w-16 h-16">
                <Spinner className="absolute inset-0 text-amber-500 animate-spin" />
              </div>
              <p className="text-white/70 font-medium tracking-wider animate-pulse">Brewing menu data...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-10 pb-16">

              {/* Search */}
              <div className="max-w-xl mx-auto w-full relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search size={20} className="text-white/40 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search coffee, e.g. 'Cold Brew' or 'Latte'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 focus:border-amber-500 rounded-full py-4 pl-14 pr-6 text-white placeholder:text-white/40 outline-none backdrop-blur-md focus:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:bg-white/10 transition-all duration-300"
                />
              </div>
              
              {/* Category Filter Pills */}
              <div className="flex justify-center gap-3 flex-wrap">
                {["All", "Hot Coffee", "Cold Coffee", "Specialty"].map((category) => (
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
                {filteredMenu.map((item) => (
                  <MenuCard key={item.id} item={item} addToCart={addToCart} getImageUrl={getImageUrl} isShopClosed={isShopClosed} />
                ))}
              </div>

              {/* Informational Section */}
              <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Our Service Commitment</h3>
                  <p className="text-white/60">We ensure premium quality at every stage of your coffee processing.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 text-white/80">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-amber-500" />
                    <span className="font-medium text-sm">Curated Beans</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-amber-500" />
                    <span className="font-medium text-sm">Certified Baristas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-amber-500" />
                    <span className="font-medium text-sm">Timely Service</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
        </PageTransition>
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

function MenuCard({ item, addToCart, getImageUrl, isShopClosed }: { item: MenuItem, addToCart: any, getImageUrl: (url: string) => string, isShopClosed?: boolean }) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  return (
    <div className="group rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl hover:bg-black/60 hover:border-white/20 transition-all duration-500 flex flex-col overflow-hidden shadow-2xl">
      {/* Visual Card Top */}
      <div className="relative w-full h-36 sm:h-52 bg-neutral-900 overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img 
            src={getImageUrl(item.images[activeImageIdx].image_url)} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-neutral-800 to-black flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600 via-transparent to-transparent"></div>
            {item.category === "Hot Coffee" ? <Flame className="text-amber-500/80 drop-shadow-lg z-10 group-hover:scale-110 transition-transform duration-500 w-9 h-9 sm:w-14 sm:h-14" />
              : item.category === "Cold Coffee" ? <CupSoda className="text-amber-500/80 drop-shadow-lg z-10 group-hover:scale-110 transition-transform duration-500 w-9 h-9 sm:w-14 sm:h-14" />
              : <Coffee className="text-amber-500/80 drop-shadow-lg z-10 group-hover:scale-110 transition-transform duration-500 w-9 h-9 sm:w-14 sm:h-14" />
            }
          </div>
        )}
        
        {/* Gradient Overlay for Text Readability over Images */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-10"></div>
        
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/60 backdrop-blur-md px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/10 flex items-center gap-1 z-20">
           <Star className="text-amber-400 fill-amber-400 w-3 h-3 sm:w-3.5 sm:h-3.5" />
           <span className="text-white text-[10px] sm:text-xs font-bold">{item.rating}</span>
        </div>
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/60 backdrop-blur-md px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/10 flex items-center gap-1 z-20">
           <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${item.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>
             {item.stock > 0 ? `Stock: ${item.stock}` : 'Out of Stock'}
           </span>
        </div>
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black/60 backdrop-blur-md px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/10 flex items-center gap-1 z-20">
           <Clock className="text-white/80 w-3 h-3 sm:w-3.5 sm:h-3.5" />
           <span className="text-white/80 text-[10px] sm:text-xs font-medium">{item.prepTime}</span>
        </div>
      </div>
      
      {/* Thumbnails for Multiple Images */}
      {item.images && item.images.length > 1 && (
        <div className="flex gap-1.5 sm:gap-2 p-2 sm:p-3 bg-neutral-900/50 border-b border-white/5 overflow-x-auto scrollbar-hide">
          {item.images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveImageIdx(idx)}
              className={`relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                activeImageIdx === idx ? 'border-amber-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={getImageUrl(img.image_url)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <h3 className="text-sm sm:text-xl font-bold text-white tracking-tight line-clamp-1">{item.name}</h3>
          <span className="self-start px-2 py-0.5 border border-amber-500/30 text-amber-500 rounded text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-amber-500/10">
            {item.category}
          </span>
        </div>
        
        <p className="text-white/60 text-[11px] sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-1 line-clamp-2 sm:line-clamp-3">{item.description}</p>
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-3 sm:pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-white/40 text-[9px] sm:text-xs font-medium mb-0.5">Price</span>
            <span className="text-base sm:text-2xl font-black text-amber-500 drop-shadow-sm">
              Rp {item.price.toLocaleString()}
            </span>
          </div>
          <button 
            onClick={() => item.stock > 0 && !isShopClosed && addToCart(item)} 
            disabled={item.stock <= 0 || isShopClosed}
            className={`w-full sm:w-auto px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-[10px] sm:text-sm transition-all ${
              item.stock > 0 && !isShopClosed
                ? "bg-amber-600 text-white hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95" 
                : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
          >
            {isShopClosed ? "Closed" : item.stock > 0 ? "Order" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}