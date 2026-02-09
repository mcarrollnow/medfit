-- Create storage bucket for theme background images
INSERT INTO storage.buckets (id, name, public)
VALUES ('theme-assets', 'theme-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for theme-assets bucket
-- Allow authenticated users to upload (admins only in practice via app logic)
CREATE POLICY "Authenticated users can upload theme assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'theme-assets');

-- Allow public read access to theme assets
CREATE POLICY "Public read access to theme assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'theme-assets');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete theme assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'theme-assets');
