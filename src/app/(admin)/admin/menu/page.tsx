"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash, Package } from "lucide-react";

export default function AdminMenuPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "0",
    category: "Coffee",
    image: "/kopi1.png",
    prepTime: "5-10 min",
    rating: "4.5"
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getImageUrl = (url: string) => {
    if (!url) return '/kopi1.png';
    if (url.startsWith('/storage/')) return `http://127.0.0.1:8000${url}`;
    if (!url.startsWith('http') && !url.startsWith('/')) return `/${url}`;
    return url;
  };

  const handleOpenModal = (product: any = null) => {
    setImageFiles([]);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        stock: product.stock || "0",
        category: product.category || "Coffee",
        images: product.images || [],
        prepTime: product.prepTime || "5-10 min",
        rating: product.rating || "4.5",
      });
      setEditingId(product.id);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "0",
        category: "Coffee",
        images: [],
        prepTime: "5-10 min",
        rating: "4.5"
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/product-images/${imageId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProducts();
        // Update local form data to remove the image immediately
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter((img: any) => img.id !== imageId)
        }));
      }
    } catch (error) {
      console.error("Error deleting image", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `http://127.0.0.1:8000/api/products/${editingId}` 
        : `http://127.0.0.1:8000/api/products`;
      
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price.toString());
      payload.append("stock", formData.stock.toString());
      payload.append("category", formData.category);
      payload.append("prepTime", formData.prepTime);
      payload.append("rating", formData.rating);
      
      if (imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          payload.append(`images[${index}]`, file);
        });
      }

      if (editingId) {
        payload.append("_method", "PUT");
      }

      const res = await fetch(url, {
        method: "POST", // Always use POST when sending FormData containing files to Laravel
        body: payload,
      });

      if (res.ok) {
        fetchProducts();
        handleCloseModal();
      } else {
        console.error("Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah anda yakin ingin menghapus menu ini?")) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error("Error deleting product", error);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <div className="bg-amber-600/20 p-2 rounded-xl">
            <Package className="text-amber-500" size={32} />
          </div>
          Manajemen Menu
        </h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all duration-300 transform hover:scale-105 border border-amber-500/50"
        >
          <Plus size={20} /> Tambah Menu
        </button>
      </div>

      <div className="bg-[#2d2d2d] border border-[#3a3a3a] shadow-2xl rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium animate-pulse">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-gray-400 text-sm uppercase tracking-wider border-b border-[#3a3a3a]">
                  <th className="p-4 font-bold">Produk</th>
                  <th className="p-4 font-bold">Kategori</th>
                  <th className="p-4 font-bold">Harga</th>
                  <th className="p-4 font-bold">Stok</th>
                  <th className="p-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a3a3a]">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#333333] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] overflow-hidden flex-shrink-0">
                          <img src={product.images && product.images.length > 0 ? getImageUrl(product.images[0].image_url) : "/kopi1.png"} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-amber-400 transition-colors">{product.name}</p>
                          <p className="text-xs text-gray-400 truncate w-48">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-[#1a1a1a] text-gray-300 px-3 py-1 rounded-full text-xs font-bold border border-[#3a3a3a]">
                        {product.category || "Coffee"}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-amber-500">
                      Rp {Number(product.price).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`font-bold ${Number(product.stock) <= 5 ? 'text-red-400' : 'text-gray-300'}`}>
                        {product.stock || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">Tidak ada data menu.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-[#2d2d2d] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-[#3a3a3a]">
            <div className="p-6 border-b border-[#3a3a3a] flex justify-between items-center bg-[#1a1a1a]">
              <h2 className="text-xl font-black text-white">
                {editingId ? "Edit Menu" : "Tambah Menu"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Nama Produk</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 bg-[#1a1a1a] text-white border border-[#3a3a3a] rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600"
                  placeholder="Kopi Susu Gula Aren"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">Harga (Rp)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full p-3 bg-[#1a1a1a] text-white border border-[#3a3a3a] rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600"
                    placeholder="Contoh: 25000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">Stok</label>
                  <input 
                    type="number" 
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full p-3 bg-[#1a1a1a] text-white border border-[#3a3a3a] rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-3 bg-[#1a1a1a] text-white border border-[#3a3a3a] rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="Hot Coffee">Hot Coffee</option>
                    <option value="Cold Coffee">Cold Coffee</option>
                    <option value="Specialty">Specialty</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">Rating (Bintang)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: e.target.value})}
                    className="w-full p-3 bg-[#1a1a1a] text-white border border-[#3a3a3a] rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600"
                    placeholder="Contoh: 4.8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">Waktu Penyajian</label>
                  <input 
                    type="text" 
                    value={formData.prepTime}
                    onChange={(e) => setFormData({...formData, prepTime: e.target.value})}
                    className="w-full p-3 bg-[#1a1a1a] text-white border border-[#3a3a3a] rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600"
                    placeholder="Contoh: 5-10 min"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Deskripsi</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 bg-[#1a1a1a] text-white border border-[#3a3a3a] rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all h-24 resize-none placeholder-gray-600"
                  placeholder="Deskripsi singkat produk..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Foto Produk Baru (Bisa pilih lebih dari 1)</label>
                <input 
                  type="file" 
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFiles(e.target.files ? Array.from(e.target.files) : [])}
                  className="w-full p-3 bg-[#1a1a1a] text-white border border-[#3a3a3a] rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer"
                />
                {editingId && formData.images && formData.images.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs text-gray-400 block mb-2">Foto Saat Ini (Klik X untuk menghapus):</span>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {formData.images.map((img: any) => (
                        <div key={img.id} className="relative group flex-shrink-0">
                          <img src={getImageUrl(img.image_url)} alt="Current" className="h-16 w-16 object-cover rounded border border-[#3a3a3a]" />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(img.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-gray-400 font-bold hover:text-white hover:bg-[#3a3a3a] rounded-xl transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-600/30 transition-all border border-amber-500/50"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
