-- Create table for landing3 image uploads
CREATE TABLE IF NOT EXISTS public.landing3_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.landing3_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access (images need to be visible on the landing page)
CREATE POLICY "landing3_images_public_read" ON public.landing3_images
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete (for admin panel)
CREATE POLICY "landing3_images_auth_write" ON public.landing3_images
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Add comment
COMMENT ON TABLE public.landing3_images IS 'Stores uploaded images for the landing3 ecommerce template page';
