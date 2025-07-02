-- Add guest fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_phone VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_name VARCHAR(255);

-- Update RLS policies to allow guest orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;

-- New policies for both authenticated and guest users
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (user_id IS NULL AND guest_email IS NOT NULL)
  );

CREATE POLICY "Users can insert orders" ON orders
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND user_id IS NULL AND guest_email IS NOT NULL)
  );

-- Allow anonymous users to insert orders
CREATE POLICY "Allow anonymous order creation" ON orders
  FOR INSERT WITH CHECK (true);

-- Update order_items policies
DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert their order items" ON order_items;

CREATE POLICY "Users can view order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR orders.guest_email IS NOT NULL)
    )
  );

CREATE POLICY "Users can insert order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR orders.guest_email IS NOT NULL)
    )
  );

-- Allow anonymous users to insert order items
CREATE POLICY "Allow anonymous order items creation" ON order_items
  FOR INSERT WITH CHECK (true);
