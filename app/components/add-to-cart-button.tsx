"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/supabase";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (!product.in_stock) {
      return;
    }

    setLoading(true);
    try {
      await addItem(product.id, quantity);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={`w-full ${className}`}
      onClick={handleAddToCart}
      disabled={!product.in_stock || loading}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {loading
        ? "Adding..."
        : product.in_stock
        ? "Add to Cart"
        : "Out of Stock"}
    </Button>
  );
}
