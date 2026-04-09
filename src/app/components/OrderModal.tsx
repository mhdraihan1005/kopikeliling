"use client";

export default function OrderModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl text-black">
        <h2>Order Coffee</h2>

        <button onClick={onClose}>Tutup</button>
      </div>
    </div>
  );
}