-- Check if orders table exists and has correct structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if order_items table exists and has correct structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check RLS policies on orders table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items');

-- Check if we can insert a test order (this will show any permission issues)
-- Note: This is just a check query, don't actually run the insert
SELECT 
    'orders' as table_name,
    has_table_privilege('orders', 'INSERT') as can_insert,
    has_table_privilege('orders', 'SELECT') as can_select;

SELECT 
    'order_items' as table_name,
    has_table_privilege('order_items', 'INSERT') as can_insert,
    has_table_privilege('order_items', 'SELECT') as can_select;

-- Test inserting a sample order (replace with actual user ID)
-- INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_status, payment_method)
-- VALUES ('your-user-id-here', 25.99, 'processing', 'Test Address', 'completed', 'credit_card');
