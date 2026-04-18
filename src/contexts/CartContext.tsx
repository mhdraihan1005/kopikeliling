"use client";

import { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext<any>(null);

// ⬇️ INI HARUS DEFAULT EXPORT
export function CartProvider({ children }: any) {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (item: any) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === item.id);

      if (exist) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });

    toast.success(
      <span>✅ Menu Berhasil Dimasukan<br/>kedalam Keranjang</span>, 
      { duration: 3000 }
    );
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => prev.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(0, item.qty + delta) };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);