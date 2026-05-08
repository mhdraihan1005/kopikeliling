"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash, Users as UsersIcon, Shield, User as UserIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    is_active: true
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

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (user: any = null) => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // empty for edit
        role: user.role || "customer",
        is_active: user.is_active ?? true
      });
      setEditingId(user.id);
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "customer",
        is_active: true
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
    if (confirm("Are you sure you want to delete this user?")) {
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

  const handleToggleStatus = async (user: any) => {
    const newStatus = !user.is_active;
    const confirmMsg = newStatus 
      ? `Activate account for ${user.name}?` 
      : `Deactivate account for ${user.name}?`;
    
    if (confirm(confirmMsg)) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: newStatus }),
        });
        if (res.ok) {
          fetchUsers();
        }
      } catch (error) {
        console.error("Error toggling status", error);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <div className="bg-amber-600/20 p-2 rounded-xl">
            <UsersIcon className="text-amber-500" size={32} />
          </div>
          User Management
        </h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all border border-amber-500/50"
        >
          <Plus size={20} /> Add New User
        </button>
      </div>

      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500 font-medium animate-pulse">Fetching users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] text-zinc-500 text-[11px] uppercase tracking-widest border-b border-white/5">
                  <th className="p-5 font-black">Identity</th>
                  <th className="p-5 font-black">Email</th>
                  <th className="p-5 font-black">Role</th>
                  <th className="p-5 font-black">Status</th>
                  <th className="p-5 font-black text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-5">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5 text-amber-500 font-bold">
                             {user.name.charAt(0)}
                          </div>
                          <span className="font-bold text-white group-hover:text-amber-400 transition-colors">{user.name}</span>
                       </div>
                    </td>
                    <td className="p-5 text-zinc-500 text-sm italic">
                      {user.email}
                    </td>
                    <td className="p-5">
                      <span className={`flex items-center w-fit gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        user.role === 'admin' 
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                          : 'bg-zinc-800 text-zinc-400 border-white/5'
                      }`}>
                        {user.role === 'admin' ? <Shield size={10} /> : <UserIcon size={10} />}
                        {user.role || 'customer'}
                      </span>
                    </td>
                    <td className="p-5">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                          user.is_active
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-500 border-rose-500/30 hover:bg-rose-500/20'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        {user.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenModal(user)}
                          className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-zinc-500 italic">No users found matching your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/10">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-xl font-black text-white">
                {editingId ? "Edit User Account" : "Create New User"}
              </h2>
              <button onClick={handleCloseModal} className="text-zinc-500 hover:text-white transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 bg-white/5 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-zinc-700 text-sm"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Role</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full p-3 bg-white/5 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 bg-white/5 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-zinc-700 text-sm"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
                  Password {editingId && <span className="text-[9px] font-normal lowercase tracking-normal opacity-50">(Leave empty to keep current)</span>}
                </label>
                <input 
                  type="password" 
                  required={!editingId}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full p-3 bg-white/5 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-zinc-700 text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                <input 
                  type="checkbox" 
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                />
                <label htmlFor="is_active" className="text-xs font-bold text-zinc-400 cursor-pointer">
                  Account is currently active and can login
                </label>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 text-zinc-500 font-bold hover:text-white transition-all text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-600/30 transition-all border border-amber-500/50 text-sm"
                >
                  {editingId ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
