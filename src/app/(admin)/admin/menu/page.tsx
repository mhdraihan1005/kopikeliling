"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash, Package } from "lucide-react";

export default function AdminMenuPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
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

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        category: product.category || "Coffee",
        image: product.image || "/kopi1.png",
        prepTime: product.prepTime || "5-10 min",
        rating: product.rating || "4.5",
      });
      setEditingId(product.id);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "Coffee",
        image: "/kopi1.png",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `http://127.0.0.1:8000/api/products/${editingId}` 
        : `http://127.0.0.1:8000/api/products`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
                  <th className="p-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a3a3a]">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#333333] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] overflow-hidden flex-shrink-0">
                          <img src={product.image || "/kopi1.png"} alt={product.name} className="w-full h-full object-cover" />
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">Harga (Rp)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full p-3 bg-[#1a1a1a] text-white border border-[#3a3a3a] rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600"
                    placeholder="25000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">Kategori</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-3 bg-[#1a1a1a] text-white border border-[#3a3a3a] rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="Non-Coffee">Non-Coffee</option>
                    <option value="Snack">Snack</option>
                  </select>
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
