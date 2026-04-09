"use client";

import Navbar from "../components/Navbar";

export default function RiwayatPage() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">

      <Navbar cartCount={0} />

      <div className="p-10">

        {/* TITLE */}
        <h1 className="text-center text-xl font-bold mb-6">
          RIWAYAT PESANAN
        </h1>

        {/* TABLE */}
        <div className="bg-white text-black rounded-lg overflow-hidden">

          {/* HEADER */}
          <div className="grid grid-cols-5 bg-gray-200 p-3 font-semibold text-sm text-center">
            <p>Produk</p>
            <p>Harga</p>
            <p>Jumlah</p>
            <p>Total Harga</p>
            <p>Order ID</p>
          </div>

          {/* ROW 1 */}
          <div className="grid grid-cols-5 items-center p-4 border-b text-center">
            
            {/* PRODUK */}
            <div className="flex items-center gap-3 justify-center">
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348"
                className="w-12 h-12 rounded"
              />
              <p className="text-xs">Coffee Aren Latte</p>
            </div>

            <p>Rp. 25.000</p>

            <p className="bg-gray-200 px-3 py-1 rounded w-fit mx-auto">
              x1
            </p>

            <p>Rp. 25.000</p>

            <p>#001</p>
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-5 items-center p-4 text-center">
            
            <div className="flex items-center gap-3 justify-center">
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348"
                className="w-12 h-12 rounded"
              />
              <p className="text-xs">Ice Butterscotch</p>
            </div>

            <p>Rp. 30.000</p>

            <p className="bg-gray-200 px-3 py-1 rounded w-fit mx-auto">
              x3
            </p>

            <p>Rp. 90.000</p>

            <p>#002</p>
          </div>

        </div>
      </div>
    </div>
  );
}