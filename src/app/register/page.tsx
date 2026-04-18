"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Coffee, Lock, Mail, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await register(name, email, password);

    if (success) {
      toast.success("Pendaftaran berhasil! Menyambungkan ke menu...");
      const userStr = localStorage.getItem('user');
      if (userStr) {
        // Karena default register adalah Customer, navigasikan ke home
        router.push('/');
      }
    } else {
      toast.error("Pendaftaran gagal. Email mungkin sudah terpakai.");
      setError("Pendaftaran gagal. Email mungkin sudah terdaftar atau password kurang dari 6 karakter.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-zinc-950">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 blur-sm"
        style={{ backgroundImage: "url('/Barista.png')" }} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />

      <div className="relative z-10 w-full max-w-md p-8 bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-600/30">
            <Coffee size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Daftar Akun Baru</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div className="space-y-1">
             <label className="text-sm text-zinc-400 font-medium ml-1">Nama Lengkap</label>
             <div className="relative">
               <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
               <input 
                 type="text"
                 required
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full bg-zinc-900/50 border border-zinc-800 text-white fill-transparent px-11 py-3.5 rounded-xl outline-none focus:border-amber-600/50 focus:ring-1 focus:ring-amber-600/50 transition-all placeholder:text-zinc-600"
                 placeholder="Budi Gunawan"
               />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-sm text-zinc-400 font-medium ml-1">Email</label>
             <div className="relative">
               <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
               <input 
                 type="email"
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full bg-zinc-900/50 border border-zinc-800 text-white fill-transparent px-11 py-3.5 rounded-xl outline-none focus:border-amber-600/50 focus:ring-1 focus:ring-amber-600/50 transition-all placeholder:text-zinc-600"
                 placeholder="email@anda.com"
               />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-sm text-zinc-400 font-medium ml-1">Password</label>
             <div className="relative">
               <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
               <input 
                 type="password"
                 required
                 minLength={6}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full bg-zinc-900/50 border border-zinc-800 text-white fill-transparent px-11 py-3.5 rounded-xl outline-none focus:border-amber-600/50 focus:ring-1 focus:ring-amber-600/50 transition-all placeholder:text-zinc-600"
                 placeholder="Minimal 6 karakter"
               />
             </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-amber-600/20"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Buat Akun"}
          </button>
        </form>

        <div className="mt-8 text-center text-zinc-500 text-sm">
          <p>
            Sudah punya akun?{" "}
            <Link href="/login" className="text-amber-500 hover:text-amber-400 font-medium underline-offset-4 hover:underline transition-all">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
