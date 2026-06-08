import { Coffee, Mail, MapPin, Phone, Globe } from "lucide-react";
import { FaInstagram, FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-zinc-400 pt-16 pb-8 border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-2xl mb-6">
              <Coffee className="text-amber-500" size={28} />
              <span className="tracking-tight">Kopi<span className="text-amber-500">Kuy!</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-6 italic">
              &quot;The best brew, delivered directly to you. Coffee made simple, with KopiKuy!&quot;
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all duration-300">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all duration-300">
                <FaGithub size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all duration-300">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* DISCOVER Section */}
          <div>
            <h4 className="text-white font-bold tracking-widest text-xs mb-8 uppercase border-l-2 border-amber-500 pl-3">Discover</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-amber-500 transition-colors flex items-center gap-2"><span>Home</span></Link></li>
              <li><Link href="/menu" className="hover:text-amber-500 transition-colors flex items-center gap-2"><span>Our Menu</span></Link></li>
              <li><Link href="/riwayat" className="hover:text-amber-500 transition-colors flex items-center gap-2"><span>Track Orders</span></Link></li>
            </ul>
          </div>

          {/* CONCIERGE Section */}
          <div>
            <h4 className="text-white font-bold tracking-widest text-xs mb-8 uppercase border-l-2 border-amber-500 pl-3">Concierge</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span>Batam Area & Surroundings</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-amber-500 shrink-0" />
                <span>+62 896-6846-8181</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-amber-500 shrink-0" />
                <span>kopikuy@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] tracking-wider uppercase">
          <p className="text-zinc-500">© {currentYear} <span className="text-zinc-300 font-bold">KopiKuy!</span> All Rights Reserved.</p>
          <div className="text-zinc-600 text-[10px]">
            Perfect for every moment.
          </div>
        </div>
      </div>
    </footer>
  );
}