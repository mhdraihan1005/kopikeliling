"use client";

import { Coffee, Tablet, BarChart2, ArrowRight, ShieldCheck } from 'lucide-react';
import CustomerNavbar from "@/components/CustomerNavbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-amber-500/30">
        <CustomerNavbar />

      <main className="flex-1 relative flex flex-col items-center justify-center px-6 py-20 lg:py-32 overflow-hidden">
        <PageTransition variant="slideUp">
          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-6xl mx-auto w-full">
          
          {/* Badge */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md mb-8 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-amber-400" />
              <span className="text-amber-400 font-black tracking-wider uppercase">NEW MEMBER SPECIAL</span>
            </div>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="text-white/80 font-medium">Register today to get a <span className="text-amber-400 font-bold">20% Welcome Discount</span> on your first order!</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Premium Scale Coffee, <br className="hidden md:block" />
            <span className="text-amber-400 font-serif italic text-5xl md:text-6xl lg:text-8xl">Straight To You.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 mb-12 max-w-3xl leading-relaxed">
            Uniting the tradition of selected coffee beans with a modern ordering system. 
            Our KopiKuy platform is ready to serve excellence in every sip, wherever you are.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-24 w-full sm:w-auto">
            <Link href="/menu" className="flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-black px-8 py-3.5 rounded font-semibold text-lg transition-all duration-300">
              Order Now
              <ArrowRight size={20} />
            </Link>
            <Link href="#features" className="flex items-center justify-center gap-3 bg-transparent hover:bg-white/10 border border-white/30 text-white px-8 py-3.5 rounded font-semibold text-lg transition-all duration-300">
              Learn More
            </Link>
          </div>

          {/* Feature Cards Showcase - Clean Minimalist Glass */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            {[
              { icon: <Coffee strokeWidth={1.5} size={32} />, label: "Curated Beans", desc: "We only serve menu variants from premium coffee that has been sorted and graded by experts." },
              { icon: <Tablet strokeWidth={1.5} size={32} />, label: "System Integration", desc: "Powered by modern ordering technology that accurately records purchase history and payment security." },
              { icon: <BarChart2 strokeWidth={1.5} size={32} />, label: "Price Certainty", desc: "Coffee investment is proportional to quality, with a transparent pricing model and no hidden fees." },
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
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}