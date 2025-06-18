import {
  supabase,
  type Product,
  type Category,
  type CartItem,
} from "@/lib/supabase";

// Product functions
export async function getProducts(filters?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}) {
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.category && filters.category !== "All") {
    query = query.eq("category", filters.category);
  }

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  if (filters?.minPrice) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters?.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters?.inStockOnly) {
    query = query.eq("in_stock", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as Product[];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data as Product;
}

export async function getFeaturedProducts(limit = 4) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("rating", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return data as Product[];
}

// Category functions
export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data as Category[];
}

// Cart functions
export async function getCartItems(userId: string) {
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      product:products(*)
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }

  return data as CartItem[];
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity = 1
) {
  const { data, error } = await supabase.from("cart_items").upsert(
    {
      user_id: userId,
      product_id: productId,
      quantity,
    },
    {
      onConflict: "user_id,product_id",
    }
  );

  if (error) {
    console.error("Error adding to cart:", error);
    return false;
  }

  return true;
}

export async function updateCartItemQuantity(
  userId: string,
  productId: string,
  quantity: number
) {
  if (quantity <= 0) {
    return removeFromCart(userId, productId);
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) {
    console.error("Error updating cart item:", error);
    return false;
  }

  return true;
}

export async function removeFromCart(userId: string, productId: string) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) {
    console.error("Error removing from cart:", error);
    return false;
  }

  return true;
}

export async function clearCart(userId: string) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("Error clearing cart:", error);
    return false;
  }

  return true;
}
