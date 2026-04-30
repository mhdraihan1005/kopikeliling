"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash, Users } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user: any = null) => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // empty for edit
        role: user.role || "customer"
      });
      setEditingId(user.id);
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "customer"
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
        ? `http://127.0.0.1:8000/api/users/${editingId}` 
        : `http://127.0.0.1:8000/api/users`;
      const method = editingId ? "PUT" : "POST";

      const payload = { ...formData };
      if (editingId && !payload.password) {
        delete (payload as any).password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchUsers();
        handleCloseModal();
      } else {
        console.error("Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah anda yakin ingin menghapus user ini?")) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchUsers();
        }
      } catch (error) {
        console.error("Error deleting user", error);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <div className="bg-amber-600/20 p-2 rounded-xl">
            <Users className="text-amber-500" size={32} />
          </div>
          Manajemen User
        </h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all duration-300 transform hover:scale-105 border border-amber-500/50"
        >
          <Plus size={20} /> Tambah User
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
                  <th className="p-4 font-bold">Nama</th>
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Role</th>
                  <th className="p-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a3a3a]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#333333] transition-colors group">
                    <td className="p-4 font-bold text-white group-hover:text-amber-400 transition-colors">
                      {user.name}
                    </td>
                    <td className="p-4 text-gray-400">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        user.role === 'admin' 
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                          : 'bg-green-500/10 text-green-500 border-green-500/30'
                      }`}>
                        {user.role || 'customer'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenModal(user)}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">Tidak ada data user.</td>
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
                {editingId ? "Edit User" : "Tambah User"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 bg-[#1a1a1a] text-white border border-[#3a3a3a] rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 bg-[#1a1a1a] text-white border border-[#3a3a3a] rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">
                  Password {editingId && <span className="text-xs font-normal text-gray-500">(Kosongkan jika tidak ingin mengubah)</span>}
                </label>
                <input 
                  type="password" 
                  required={!editingId}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full p-3 bg-[#1a1a1a] text-white border border-[#3a3a3a] rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full p-3 bg-[#1a1a1a] text-white border border-[#3a3a3a] rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
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
