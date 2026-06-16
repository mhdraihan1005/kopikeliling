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
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Tunggu localStorage terupdate, lalu kita redirect manual dengan window location ATAU useRouter
      // Biar lebih aman karena hook mungkin lag
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        toast.success(`Welcome back, ${user.name}!`);
        if (user.role === 'admin') router.push('/admin');
        else router.push('/');
      }
    } else {
      const msg = result.message || "Incorrect email or password!";
      toast.error(msg);
      setError(msg);
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
          <img src="/logo.png" alt="Kopi Kuy Logo" className="h-20 w-auto object-contain" />
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Start Your Day with<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">
              The Best Coffee.
            </span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Order your favorite KopiKuy from anywhere, and we will deliver it with a smile.
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
            <div className="mb-6 lg:hidden">
              <img src="/logo.png" alt="Kopi Kuy Logo" className="h-24 w-auto object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 text-center lg:text-left">Welcome Back</h2>
            <p className="text-zinc-400 text-center lg:text-left text-sm">Please enter your email and password.</p>
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
                 <button 
                   type="button"
                   onClick={() => setShowForgotModal(true)} 
                   className="text-xs text-amber-500 hover:text-amber-400 transition-colors outline-none focus:underline"
                 >
                   Forgot password?
                 </button>
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
              {loading ? <Loader2 size={20} className="animate-spin" /> : "Sign In"}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink mx-4 text-zinc-500 text-xs font-bold uppercase tracking-wider">Or</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <Link 
              href="/" 
              className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold py-4 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              Continue as Guest
            </Link>
          </form>

          <div className="mt-10 text-center">
            <p className="text-zinc-500 text-sm mb-6">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-amber-500 hover:text-amber-400 font-medium hover:underline underline-offset-4 transition-all">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 text-amber-500">
                <Coffee size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Forgot Password?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                For security reasons, automatic password resets are currently disabled. Please contact the administrator or cashier at the counter to reset your password, or click below to chat with our customer support:
              </p>
              
              <a 
                href="https://wa.me/6289668468181?text=Halo%20Admin%20KopiKuy,%20saya%20lupa%20password%20akun%20saya%20dan%20ingin%20meminta%20reset%20password." 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors mb-3 shadow-lg shadow-emerald-600/20"
              >
                Chat Admin on WhatsApp
              </a>
              
              <button 
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-full bg-transparent hover:bg-white/5 border border-zinc-800 text-zinc-500 hover:text-zinc-300 font-medium py-3 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
