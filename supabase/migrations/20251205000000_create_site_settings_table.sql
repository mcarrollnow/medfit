-- Create site_settings table for comprehensive website configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT '1',
  
  -- Branding
  site_name TEXT NOT NULL DEFAULT 'My Store',
  site_tagline TEXT DEFAULT '',
  logo_light_url TEXT DEFAULT '',
  logo_dark_url TEXT DEFAULT '',
  favicon_light_url TEXT DEFAULT '',
  favicon_dark_url TEXT DEFAULT '',
  favicon_safari_url TEXT DEFAULT '',
  apple_touch_icon_url TEXT DEFAULT '',
  mask_icon_url TEXT DEFAULT '',
  mask_icon_color TEXT DEFAULT '#000000',
  
  -- SEO
  browser_title TEXT NOT NULL DEFAULT 'My Store',
  title_separator TEXT DEFAULT '|',
  meta_description TEXT DEFAULT '',
  meta_keywords TEXT DEFAULT '',
  canonical_url TEXT DEFAULT '',
  robots_index BOOLEAN DEFAULT true,
  robots_follow BOOLEAN DEFAULT true,
  google_site_verification TEXT DEFAULT '',
  bing_site_verification TEXT DEFAULT '',
  
  -- PWA / App
  app_name TEXT DEFAULT 'My Store',
  app_short_name TEXT DEFAULT 'Store',
  app_description TEXT DEFAULT '',
  theme_color TEXT DEFAULT '#000000',
  background_color TEXT DEFAULT '#000000',
  display_mode TEXT DEFAULT 'standalone',
  start_url TEXT DEFAULT '/',
  app_icon_192_url TEXT DEFAULT '',
  app_icon_512_url TEXT DEFAULT '',
  
  -- Social / Open Graph
  og_title TEXT DEFAULT '',
  og_description TEXT DEFAULT '',
  og_image_url TEXT DEFAULT '',
  og_site_name TEXT DEFAULT '',
  og_type TEXT DEFAULT 'website',
  twitter_card TEXT DEFAULT 'summary_large_image',
  twitter_site TEXT DEFAULT '',
  twitter_creator TEXT DEFAULT '',
  
  -- Analytics
  google_analytics_id TEXT DEFAULT '',
  google_tag_manager_id TEXT DEFAULT '',
  facebook_pixel_id TEXT DEFAULT '',
  
  -- Code Injection
  custom_head_code TEXT DEFAULT '',
  custom_body_start_code TEXT DEFAULT '',
  custom_body_end_code TEXT DEFAULT '',
  custom_css TEXT DEFAULT '',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default row
INSERT INTO site_settings (id) VALUES ('1')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can insert site settings" ON site_settings;

-- Everyone can read site settings (needed for meta tags, manifest, etc.)
CREATE POLICY "Anyone can read site settings"
  ON site_settings
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only admins can update site settings
CREATE POLICY "Admins can update site settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Only admins can insert site settings
CREATE POLICY "Admins can insert site settings"
  ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_settings_updated_at ON site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();

-- Create the site-assets storage bucket if it doesn't exist
-- Note: Run this in Supabase dashboard or via supabase CLI
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('site-assets', 'site-assets', true)
-- ON CONFLICT (id) DO NOTHING;
