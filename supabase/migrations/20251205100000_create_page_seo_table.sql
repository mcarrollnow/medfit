-- Create page_seo table for page-specific SEO settings
CREATE TABLE IF NOT EXISTS page_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  keywords TEXT,
  no_index BOOLEAN DEFAULT false,
  no_follow BOOLEAN DEFAULT false,
  canonical_url TEXT,
  ai_generated BOOLEAN DEFAULT false,
  last_ai_update TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster path lookups
CREATE INDEX IF NOT EXISTS idx_page_seo_path ON page_seo(path);

-- Enable RLS
ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read page seo" ON page_seo;
DROP POLICY IF EXISTS "Admins can manage page seo" ON page_seo;

-- Anyone can read page SEO (needed for meta tags)
CREATE POLICY "Anyone can read page seo"
ON page_seo FOR SELECT
TO public
USING (true);

-- Admins can do everything
CREATE POLICY "Admins can manage page seo"
ON page_seo FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_page_seo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS page_seo_updated_at ON page_seo;
CREATE TRIGGER page_seo_updated_at
  BEFORE UPDATE ON page_seo
  FOR EACH ROW
  EXECUTE FUNCTION update_page_seo_updated_at();

-- Insert some default pages
INSERT INTO page_seo (path, title, description) VALUES
  ('/', 'Home', 'Welcome to our store'),
  ('/products', 'Products', 'Browse our product catalog'),
  ('/cart', 'Shopping Cart', 'Your shopping cart'),
  ('/checkout', 'Checkout', 'Complete your purchase'),
  ('/login', 'Login', 'Sign in to your account'),
  ('/register', 'Register', 'Create a new account'),
  ('/support', 'Support', 'Get help and support'),
  ('/admin', 'Admin Dashboard', 'Administration panel')
ON CONFLICT (path) DO NOTHING;

