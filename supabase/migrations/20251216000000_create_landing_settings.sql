-- Create landing_settings table for customizing the landing page
CREATE TABLE IF NOT EXISTS landing_settings (
  id TEXT PRIMARY KEY DEFAULT '1',
  hero_slogan TEXT NOT NULL DEFAULT 'Welcome to Modern Health Pro',
  hero_subtitle TEXT DEFAULT 'Premium research compounds for scientific discovery',
  background_style TEXT DEFAULT 'aurora',
  background_color_1 TEXT DEFAULT '#0f0f23',
  background_color_2 TEXT DEFAULT '#1a1a3e',
  background_color_3 TEXT DEFAULT '#0a192f',
  show_subtitle BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default row if not exists
INSERT INTO landing_settings (id)
VALUES ('1')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE landing_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for landing page to load settings)
CREATE POLICY "Allow public read access to landing_settings"
  ON landing_settings
  FOR SELECT
  USING (true);

-- Allow admins to update
CREATE POLICY "Allow admins to update landing_settings"
  ON landing_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );

-- Allow service role full access
CREATE POLICY "Allow service role full access to landing_settings"
  ON landing_settings
  FOR ALL
  USING (auth.role() = 'service_role');

