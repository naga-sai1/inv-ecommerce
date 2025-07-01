-- Add columns to support guest checkout
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS guest_email TEXT,
ADD COLUMN IF NOT EXISTS guest_phone TEXT,
ADD COLUMN IF NOT EXISTS guest_name TEXT;

-- Update the user_id column to allow NULL for guest orders
ALTER TABLE orders 
ALTER COLUMN user_id DROP NOT NULL;

-- Create index for guest orders
CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON orders(guest_email);
CREATE INDEX IF NOT EXISTS idx_orders_guest_phone ON orders(guest_phone);

-- Update RLS policies to allow guest orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;

-- New policies that support both authenticated users and guest orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (
        auth.uid() = user_id OR 
        (user_id IS NULL AND guest_email IS NOT NULL)
    );

CREATE POLICY "Users can create orders" ON orders
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        (user_id IS NULL AND guest_email IS NOT NULL)
    );

-- Allow anonymous users to create guest orders
CREATE POLICY "Allow guest orders" ON orders
    FOR INSERT WITH CHECK (
        user_id IS NULL AND 
        guest_email IS NOT NULL AND 
        guest_phone IS NOT NULL AND 
        guest_name IS NOT NULL
    );

-- Update order_items policies to work with guest orders
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create own order items" ON order_items;

CREATE POLICY "Users can view order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
        )
    );

CREATE POLICY "Users can create order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
        )
    );
