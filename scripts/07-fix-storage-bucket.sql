-- Update the storage bucket name to match your actual bucket
-- First, check if the bucket exists
SELECT * FROM storage.buckets WHERE id = 'inv-ecommerce-image';

-- If it doesn't exist, create it
INSERT INTO storage.buckets (id, name, public) 
VALUES ('inv-ecommerce-image', 'inv-ecommerce-image', true)
ON CONFLICT (id) DO NOTHING;

-- Update storage policies for the correct bucket name
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Create new policies with correct bucket name
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'inv-ecommerce-image');

CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'inv-ecommerce-image' AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'inv-ecommerce-image' AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete images" ON storage.objects FOR DELETE USING (
  bucket_id = 'inv-ecommerce-image' AND auth.role() = 'authenticated'
);
