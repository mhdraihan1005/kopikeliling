import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />

      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-4">
          ☕ E-Coffee Keliling
        </h1>

        <p className="mb-6">
          Platform pemesanan kopi online cepat & mudah
        </p>

        <button className="bg-white text-black px-6 py-2 rounded-lg">
          Mulai Pesan
        </button>
      </div>
    </div>
  );
}