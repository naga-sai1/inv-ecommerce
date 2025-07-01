-- Fix missing profiles for existing users
-- This script will create profiles for users who exist in auth.users but not in profiles table

-- First, let's see which users are missing profiles
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name' as full_name
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Create profiles for users who don't have one
INSERT INTO profiles (id, email, full_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  NOW(),
  NOW()
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify the fix
SELECT 
  au.id,
  au.email,
  p.full_name,
  p.created_at
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC; 