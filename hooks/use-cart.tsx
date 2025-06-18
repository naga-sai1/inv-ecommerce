"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useUser } from "@supabase/auth-helpers-react";
import {
  getCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "@/lib/database";
import type { CartItem } from "@/lib/supabase";

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useUser();

  const loadCart = async () => {
    if (!user?.id) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const cartItems = await getCartItems(user.id);
    setItems(cartItems);
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, [user?.id]);

  const addItem = async (productId: string, quantity = 1) => {
    if (!user?.id) return;

    const success = await addToCart(user.id, productId, quantity);
    if (success) {
      await loadCart();
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user?.id) return;

    const success = await updateCartItemQuantity(user.id, productId, quantity);
    if (success) {
      await loadCart();
    }
  };

  const removeItem = async (productId: string) => {
    if (!user?.id) return;

    const success = await removeFromCart(user.id, productId);
    if (success) {
      await loadCart();
    }
  };

  const clearCartItems = async () => {
    if (!user?.id) return;

    const success = await clearCart(user.id);
    if (success) {
      await loadCart();
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart: clearCartItems,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
