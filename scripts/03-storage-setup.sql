-- Create storage policies for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('inv-ecommerce-image', 'inv-ecommerce-image', true);

-- Allow public access to view images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'inv-ecommerce-image');

-- Allow authenticated users to upload images (for admin)
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'inv-ecommerce-image' AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update images (for admin)
CREATE POLICY "Authenticated users can update images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'inv-ecommerce-image' AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete images (for admin)
CREATE POLICY "Authenticated users can delete images" ON storage.objects FOR DELETE USING (
  bucket_id = 'inv-ecommerce-image' AND auth.role() = 'authenticated'
);
