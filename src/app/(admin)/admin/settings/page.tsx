"use client";

import React, { useEffect, useState } from "react";
import { Settings, Home, User, DollarSign, Bell, Check, Shield, Globe, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general"); // general, profile, payment

  const [settings, setSettings] = useState({
    shop_name: "",
    shop_address: "",
    shop_phone: "",
    shop_instagram: "",
    shop_status: "open",
    shop_open_hours: "",
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success("Pengaturan berhasil disimpan!");
      } else {
        toast.error("Gagal menyimpan pengaturan.");
      }
    } catch (error) {
      console.error("Error saving settings", error);
      toast.error("Terjadi kesalahan koneksi.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "general", name: "Umum", icon: <Home size={20} /> },
    { id: "profile", name: "Profil Admin", icon: <User size={20} /> },
    { id: "payment", name: "Pembayaran", icon: <DollarSign size={20} /> },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <div className="bg-amber-600/20 p-2 rounded-xl">
              <Settings className="text-amber-500" size={32} />
            </div>
            Pengaturan Sistem
          </h1>
          <p className="text-zinc-400 mt-2">Kelola identitas dan operasional kedai kopi Anda.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-zinc-900/50 border border-zinc-800 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl">
          {loading ? (
            <div className="py-20 text-center text-zinc-500 animate-pulse font-medium">Memuat pengaturan...</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {activeTab === "general" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                        <Home size={16} className="text-amber-500" /> Nama Kedai
                      </label>
                      <input 
                        type="text" 
                        value={settings.shop_name}
                        onChange={(e) => setSettings({...settings, shop_name: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                        placeholder="KopiKuy"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                        <Clock size={16} className="text-amber-500" /> Jam Operasional
                      </label>
                      <input 
                        type="text" 
                        value={settings.shop_open_hours}
                        onChange={(e) => setSettings({...settings, shop_open_hours: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                        placeholder="08:00 - 20:00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                      <MapPin size={16} className="text-amber-500" /> Alamat Kedai
                    </label>
                    <textarea 
                      value={settings.shop_address}
                      onChange={(e) => setSettings({...settings, shop_address: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all h-24 resize-none"
                      placeholder="Masukkan alamat lengkap..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                        <Phone size={16} className="text-amber-500" /> WhatsApp (Aktif)
                      </label>
                      <input 
                        type="text" 
                        value={settings.shop_phone}
                        onChange={(e) => setSettings({...settings, shop_phone: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                        placeholder="0812..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                        <Globe size={16} className="text-amber-500" /> Instagram Username
                      </label>
                      <input 
                        type="text" 
                        value={settings.shop_instagram}
                        onChange={(e) => setSettings({...settings, shop_instagram: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800">
                    <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${settings.shop_status === 'open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Status Operasional Toko</p>
                          <p className="text-xs text-zinc-500">{settings.shop_status === 'open' ? 'Pelanggan dapat melakukan pemesanan' : 'Pemesanan dinonaktifkan sementara'}</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setSettings({...settings, shop_status: settings.shop_status === 'open' ? 'closed' : 'open'})}
                        className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${
                          settings.shop_status === 'open' 
                            ? "bg-emerald-600 text-white" 
                            : "bg-rose-600 text-white"
                        }`}
                      >
                        {settings.shop_status === 'open' ? 'BUKA' : 'TUTUP'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "profile" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                      <Shield className="text-amber-500 mt-1" size={18} />
                      <p className="text-xs text-amber-200/70 leading-relaxed">
                        Anda sedang mengelola akun administrator utama. Perubahan pada password akan memerlukan login ulang pada sesi berikutnya.
                      </p>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-300">Username Admin</label>
                      <input 
                        type="text" 
                        defaultValue="Administrator"
                        disabled
                        className="w-full bg-zinc-800/50 border border-zinc-800 text-zinc-500 p-3 rounded-xl cursor-not-allowed"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-300">Email Utama</label>
                      <input 
                        type="email" 
                        defaultValue="admin@email.com"
                        disabled
                        className="w-full bg-zinc-800/50 border border-zinc-800 text-zinc-500 p-3 rounded-xl cursor-not-allowed"
                      />
                   </div>
                   <button 
                    type="button"
                    onClick={() => toast.success("Fitur ubah password ada di manajemen user!")}
                    className="text-amber-500 text-sm font-bold hover:underline"
                   >
                     Klik di sini untuk manajemen keamanan lebih lanjut &rarr;
                   </button>
                </div>
              )}

              {activeTab === "payment" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-8 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                      <DollarSign size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Midtrans Payment Gateway</h3>
                      <p className="text-sm text-zinc-500 mt-1 max-w-xs mx-auto">
                        Integrasi pembayaran otomatis sedang aktif menggunakan mode <b>Sandbox</b>.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full border border-emerald-500/30">Terhubung</span>
                      <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase rounded-full border border-zinc-700">Sandbox Mode</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest font-black">
                    Api key dikelola melalui file environment (.env) untuk keamanan
                  </p>
                </div>
              )}

              <div className="pt-6 border-t border-zinc-800 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-600/20 transition-all transform active:scale-95"
                >
                  {saving ? <Check className="animate-pulse" size={20} /> : <Check size={20} />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
