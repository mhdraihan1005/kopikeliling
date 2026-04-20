"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Coffee, Lock, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      // Tunggu localStorage terupdate, lalu kita redirect manual dengan window location ATAU useRouter
      // Biar lebih aman karena hook mungkin lag
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        toast.success(`Selamat datang kembali, ${user.name}!`);
        if (user.role === 'admin') router.push('/admin');
        else router.push('/');
      }
    } else {
      toast.error("Email atau Password salah!");
      setError("Email atau Password salah!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Kiri - Background & Branding (Hanya desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('/Barista.png')" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-600/20 backdrop-blur-sm border border-amber-500/50 rounded-xl flex items-center justify-center">
            <Coffee size={24} className="text-amber-500" />
          </div>
          <span className="text-xl font-bold text-white tracking-widest uppercase">E-Coffee</span>
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Mulai Hari Anda dengan<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">
              Kopi Terbaik.
            </span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Pesan kopi keliling favorit Anda dari mana saja, dan kami akan mengantarkannya dengan senyum.
          </p>
        </div>
      </div>

      {/* Kanan - Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
        {/* Mobile Background (hanya muncul di layar kecil) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 lg:hidden"
          style={{ backgroundImage: "url('/Barista.png')" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-zinc-950/40 lg:hidden" />
        
        {/* Container Form */}
        <div className="w-full max-w-sm relative z-10">
          <div className="flex flex-col items-center lg:items-start mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center mb-6 lg:hidden shadow-lg shadow-amber-600/30">
              <Coffee size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 text-center lg:text-left">Selamat Datang</h2>
            <p className="text-zinc-400 text-center lg:text-left text-sm">Silakan masukkan email dan sandi Anda.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl mb-8 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="space-y-2">
               <label className="text-sm text-zinc-300 font-medium ml-1">Email Address</label>
               <div className="relative group">
                 <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                 <input 
                   type="email"
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full bg-zinc-900/50 lg:bg-zinc-900 border border-zinc-800 text-white px-11 py-3.5 rounded-2xl outline-none focus:bg-zinc-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all placeholder:text-zinc-600"
                   placeholder="admin@email.com"
                 />
               </div>
            </div>

            <div className="space-y-2">
               <div className="flex items-center justify-between ml-1">
                 <label className="text-sm text-zinc-300 font-medium">Password</label>
                 <a href="#" className="text-xs text-amber-500 hover:text-amber-400 transition-colors">Lupa sandi?</a>
               </div>
               <div className="relative group">
                 <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                 <input 
                   type="password"
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full bg-zinc-900/50 lg:bg-zinc-900 border border-zinc-800 text-white px-11 py-3.5 rounded-2xl outline-none focus:bg-zinc-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all placeholder:text-zinc-600"
                   placeholder="••••••••"
                 />
               </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 disabled:grayscale text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-amber-600/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : "Masuk ke Akun"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-zinc-500 text-sm mb-6">
              Belum punya akun?{" "}
              <Link href="/register" className="text-amber-500 hover:text-amber-400 font-medium hover:underline underline-offset-4 transition-all">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
