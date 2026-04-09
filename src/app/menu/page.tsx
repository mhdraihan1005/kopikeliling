"use client";

import Navbar from "../components/Navbar";
import OrderModal from "../components/OrderModal";
import { useState } from "react";

export default function MenuPage() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState(0);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      
      {/* NAVBAR */}
      <Navbar cartCount={cart} />

      {/* SEARCH */}
      <div className="flex justify-center mt-6">
        <input
          placeholder="Search Menu..."
          className="px-4 py-2 rounded text-black w-80"
        />
      </div>

      {/* MENU GRID */}
      <div className="p-10 grid grid-cols-4 gap-6">

        {/* CARD 1 */}
        <div className="bg-white text-black p-4 rounded-xl shadow">
          <img
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348"
            className="rounded-lg mb-3 w-full h-40 object-cover"
          />

          <h3 className="font-bold text-sm">Coffee Aren Latte</h3>

          <p className="text-xs text-gray-500 mb-2">
            Perpaduan kopi robusta dengan susu
          </p>

          <button
            onClick={() => {
              setOpen(true);
              setCart(cart + 1);
            }}
            className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
          >
            Order Now
          </button>
        </div>

        {/* CARD 2 */}
        <div className="bg-white text-black p-4 rounded-xl shadow">
          <img
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348"
            className="rounded-lg mb-3 w-full h-40 object-cover"
          />

          <h3 className="font-bold text-sm">Ice Butterscotch</h3>

          <p className="text-xs text-gray-500 mb-2">
            Perpaduan kopi robusta dengan susu
          </p>

          <button
            onClick={() => {
              setOpen(true);
              setCart(cart + 1);
            }}
            className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
          >
            Order Now
          </button>
        </div>

      </div>

      {/* MODAL */}
      <OrderModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}