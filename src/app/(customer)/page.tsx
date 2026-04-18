"use client";

import { Coffee, Tablet, BarChart2, ArrowRight, ShieldCheck } from 'lucide-react';
import CustomerNavbar from "@/components/CustomerNavbar";
import Footer from "@/components/Footer";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black selection:bg-amber-500/30">
      <CustomerNavbar />

      <main className="flex-1 relative flex flex-col items-center justify-center px-6 py-20 lg:py-32 overflow-hidden">
        {/* Full-Screen Background Image (Retained) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/Barista.png')" }}
        />
        {/* Professional Dark Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-6xl mx-auto w-full">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md mb-8">
            <ShieldCheck size={16} className="text-amber-400" />
            <span className="text-white/80 text-sm font-semibold tracking-wider uppercase">Standar Kualitas Kafe Bintang 5</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Kopi Skala Premium, <br className="hidden md:block" />
            <span className="text-amber-400 font-serif italic text-5xl md:text-6xl lg:text-8xl">Langsung Untuk Anda.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 mb-12 max-w-3xl leading-relaxed">
            Menyatukan tradisi biji kopi pilihan dengan sistem pemesanan modern. 
            Platform E-Coffee Keliling kami siap menyajikan keunggulan cita rasa di setiap tegukan, di mana pun Anda berada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-24 w-full sm:w-auto">
            <Link href="/menu" className="flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-black px-8 py-3.5 rounded font-semibold text-lg transition-all duration-300">
              Pesan Sekarang
              <ArrowRight size={20} />
            </Link>
            <Link href="#features" className="flex items-center justify-center gap-3 bg-transparent hover:bg-white/10 border border-white/30 text-white px-8 py-3.5 rounded font-semibold text-lg transition-all duration-300">
              Lebih Lanjut
            </Link>
          </div>

          {/* Feature Cards Showcase - Clean Minimalist Glass */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            {[
              { icon: <Coffee strokeWidth={1.5} size={32} />, label: "Kurasi Biji Kopi", desc: "Kami hanya menyajikan varian menu dari kopi premium yang telah disortir dan dinilai kelayakannya oleh para ahli." },
              { icon: <Tablet strokeWidth={1.5} size={32} />, label: "Integrasi Sistem", desc: "Didukung oleh teknologi pemesanan modern yang mencatat secara akurat histori pembelian dan keamanan pembayaran Anda." },
              { icon: <BarChart2 strokeWidth={1.5} size={32} />, label: "Kepastian Harga", desc: "Investasi cita rasa kopi sebanding dengan kualitas, dengan model harga yang transparan tanpa biaya tersembunyi." },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/20 p-8 flex flex-col transition-all duration-300 group rounded-xl"
              >
                <div className="mb-6 text-amber-500 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300">
                   {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{item.label}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}