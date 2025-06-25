# Database Setup Guide

This guide will help you set up the database and fix the profile creation issues.

## Prerequisites

1. Make sure you have access to your Supabase project dashboard
2. Have your Supabase project URL and anon key ready

## Database Setup Steps

### 1. Run the Initial Setup Scripts

Execute these scripts in your Supabase SQL editor in the following order:

1. **01-create-tables.sql** - Creates all the database tables
2. **02-seed-data.sql** - Adds sample data (optional)
3. **03-storage-setup.sql** - Sets up storage buckets
4. **04-fix-profiles-policy.sql** - Fixes the RLS policy for profiles
5. **05-create-profile-function.sql** - Creates the profile creation function

### 2. How to Run the Scripts

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** section
3. Copy and paste each script content
4. Click **Run** to execute the script
5. Repeat for each script in order

### 3. Verify the Setup

After running all scripts, you can verify the setup by running this query:

```sql
-- Check if profiles table exists and has the correct structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if RLS policies are in place
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Check if the function exists
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'create_user_profile';
```

## Troubleshooting

### Profile Creation Error

If you're still getting "Create profile error: {}" after running the scripts:

1. **Check RLS Policies**: Make sure the insert policy for profiles is in place
2. **Check Function**: Verify the `create_user_profile` function exists
3. **Check Permissions**: Ensure authenticated users have the necessary permissions

### Common Issues

1. **RLS Policy Missing**: The profiles table needs an insert policy
2. **Function Not Found**: The `create_user_profile` function might not exist
3. **Permission Denied**: Users might not have the right permissions

### Manual Fix

If the scripts don't work, you can manually run these commands:

```sql
-- Add the missing insert policy
CREATE POLICY "Users can insert own profile" ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create the profile function
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_full_name TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, created_at, updated_at)
  VALUES (user_id, user_email, user_full_name, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    updated_at = NOW();
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creating profile for user %: %', user_id, SQLERRM;
    RETURN FALSE;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION create_user_profile(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile(UUID, TEXT, TEXT) TO service_role;
```

## Testing the Fix

After running the scripts:

1. Try registering a new user
2. Check the browser console for any error messages
3. Verify that the user profile is created in the database
4. Try signing in with the new user

## Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Support

If you're still experiencing issues:

1. Check the browser console for detailed error messages
2. Verify all scripts have been executed successfully
3. Check the Supabase logs for any database errors
4. Ensure your environment variables are correctly set 