"use client";

import { Coffee, Tablet, BarChart2 } from 'lucide-react';
import CustomerNavbar from "./components/CustomerNavbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomerNavbar />

      <div className="flex-1 relative flex flex-col items-center justify-center px-6 py-16">
        {/* Background */}
        <div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/Barista.png')", filter: 'brightness(0.4)' }}
/>
        <div className="absolute inset-0 bg-black/50" />

        {/* Konten */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">
            Selamat Datang di E-Coffee Keliling
          </h1>
          <p className="text-white/80 mb-8 leading-relaxed">
            Platform digital E-Coffee Keliling yang menyediakan layanan pemesanan
            kopi secara online, memungkinkan pelanggan memilih menu, melakukan
            pembayaran digital, serta menikmati proses transaksi yang cepat dan mudah
          </p>
          <button className="bg-white/90 hover:bg-white text-gray-800 px-8 py-2.5 rounded-lg font-medium transition-colors mb-12">
            Click for order
          </button>

          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-4 w-full">
            {[
              { icon: <Coffee size={32} />, label: "Menu Kopi Lengkap" },
              { icon: <Tablet size={32} />, label: "Pemesanan Online" },
              { icon: <BarChart2 size={32} />, label: "Harga Kompetitif" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6 flex flex-col items-start gap-3 text-white"
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}