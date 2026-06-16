"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

const CartContext = createContext<any>(null);

// ⬇️ INI HARUS DEFAULT EXPORT
export function CartProvider({ children }: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { user } = useAuth();
  const [prevUser, setPrevUser] = useState<any>(null);

  // Load from localStorage on mount (Client-side only)
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse saved cart", e);
      }
    }
    setHasLoaded(true);
  }, []);

  // Save to localStorage when cart changes (after loading has finished)
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, hasLoaded]);

  // Clear cart when user transitions from logged-in to logged-out (logout)
  useEffect(() => {
    if (hasLoaded && prevUser && !user) {
      setCart([]);
      localStorage.removeItem("cart");
    }
    setPrevUser(user);
  }, [user, hasLoaded, prevUser]);

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
      <span>✅ Item successfully added<br/>to cart</span>, 
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

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);