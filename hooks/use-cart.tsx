"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "@/lib/database";
import type { CartItem } from "@/lib/supabase";
import { useAuth } from "./use-auth";
import { toast } from "@/hooks/use-toast";

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
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

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
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    const success = await addToCart(user.id, productId, quantity);
    if (success) {
      await loadCart();
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user?.id) return;

    const success = await updateCartItemQuantity(user.id, productId, quantity);
    if (success) {
      await loadCart();
    } else {
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (productId: string) => {
    if (!user?.id) return;

    const success = await removeFromCart(user.id, productId);
    if (success) {
      await loadCart();
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearCartItems = async () => {
    if (!user?.id) return;

    const success = await clearCart(user.id);
    if (success) {
      await loadCart();
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
      });
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
