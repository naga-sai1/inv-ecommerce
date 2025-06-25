-- Add missing RLS policy for profiles table to allow users to insert their own profile
-- This policy is needed for the signup flow to work properly

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Also add a policy to allow the service role to insert profiles (for admin operations)
-- This is useful if you need to create profiles programmatically
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

CREATE POLICY "Service role can insert profiles" ON profiles 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON profiles TO authenticated; 