-- Create themes table for customizable color schemes
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  is_system BOOLEAN DEFAULT false, -- System themes (dark/light) cannot be deleted
  
  -- Main Background Colors (RGB values)
  bg_primary TEXT NOT NULL, -- Main background
  bg_secondary TEXT NOT NULL, -- Secondary background
  
  -- Card Colors
  card_bg TEXT NOT NULL,
  card_hover TEXT NOT NULL,
  card_border TEXT NOT NULL,
  
  -- Text Colors
  text_primary TEXT NOT NULL,
  text_secondary TEXT NOT NULL,
  text_muted TEXT NOT NULL,
  
  -- Sidebar Colors (HSL values)
  sidebar_bg TEXT NOT NULL,
  sidebar_fg TEXT NOT NULL,
  sidebar_primary TEXT NOT NULL,
  sidebar_primary_fg TEXT NOT NULL,
  sidebar_accent TEXT NOT NULL,
  sidebar_accent_fg TEXT NOT NULL,
  sidebar_border TEXT NOT NULL,
  sidebar_ring TEXT NOT NULL,
  
  -- Brand Accent Colors (HEX values)
  yellow_primary TEXT DEFAULT '#fff95e',
  purple_primary TEXT DEFAULT '#6609ff',
  red_accent TEXT DEFAULT '#e60041',
  pink_accent TEXT DEFAULT '#ff4dfd',
  blue_accent TEXT DEFAULT '#1086ff',
  green_accent TEXT DEFAULT '#47ff7b',
  orange_accent TEXT DEFAULT '#ff9845',
  gray_neutral TEXT DEFAULT '#818181',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX idx_themes_slug ON themes(slug);
CREATE INDEX idx_themes_active ON themes(is_active);

-- Enable RLS
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read themes (including anonymous users)
CREATE POLICY "Anyone can read themes"
  ON themes
  FOR SELECT
  USING (true);

-- Only admins can insert/update/delete themes
CREATE POLICY "Admins can manage themes"
  ON themes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Insert default themes (Dark Mode - currently active)
INSERT INTO themes (name, slug, description, is_active, is_system, 
  bg_primary, bg_secondary, card_bg, card_hover, card_border,
  text_primary, text_secondary, text_muted,
  sidebar_bg, sidebar_fg, sidebar_primary, sidebar_primary_fg,
  sidebar_accent, sidebar_accent_fg, sidebar_border, sidebar_ring)
VALUES 
  -- Dark Mode (Current Default)
  (
    'Dark Mode',
    'dark',
    'Default dark theme with black cards and dark gray backgrounds',
    true,
    true,
    '17 24 39', -- gray-900
    '0 0 0', -- black
    '0 0 0', -- black
    '31 41 55', -- gray-800
    '31 41 55', -- gray-800
    '255 255 255', -- white
    '156 163 175', -- gray-400
    '107 114 128', -- gray-500
    '0 0% 0%', -- black
    '0 0% 100%', -- white
    '0 0% 100%', -- white
    '0 0% 0%', -- black
    '0 0% 10%', -- very dark gray
    '0 0% 100%', -- white
    '0 0% 15%', -- dark gray
    '0 0% 20%' -- dark gray
  ),
  
  -- Light Mode
  (
    'Light Mode',
    'light',
    'Clean light theme with white cards and gray backgrounds',
    false,
    true,
    '155 155 155', -- #9b9b9b
    '155 155 155', -- #9b9b9b
    '255 255 255', -- white
    '249 250 251', -- gray-50
    '0 0 0', -- black
    '0 0 0', -- black
    '55 65 81', -- gray-700
    '107 114 128', -- gray-500
    '0 0% 100%', -- white
    '0 0% 0%', -- black
    '0 0% 0%', -- black
    '0 0% 100%', -- white
    '0 0% 96%', -- light gray
    '0 0% 0%', -- black
    '0 0% 0%', -- black
    '0 0% 70%' -- gray
  ),
  
  -- Custom Theme 1 (Blank Template)
  (
    'Custom Theme 1',
    'custom-1',
    'Customizable theme - configure your own colors',
    false,
    false,
    '17 24 39',
    '0 0 0',
    '0 0 0',
    '31 41 55',
    '31 41 55',
    '255 255 255',
    '156 163 175',
    '107 114 128',
    '0 0% 0%',
    '0 0% 100%',
    '0 0% 100%',
    '0 0% 0%',
    '0 0% 10%',
    '0 0% 100%',
    '0 0% 15%',
    '0 0% 20%'
  ),
  
  -- Custom Theme 2 (Blank Template)
  (
    'Custom Theme 2',
    'custom-2',
    'Customizable theme - configure your own colors',
    false,
    false,
    '17 24 39',
    '0 0 0',
    '0 0 0',
    '31 41 55',
    '31 41 55',
    '255 255 255',
    '156 163 175',
    '107 114 128',
    '0 0% 0%',
    '0 0% 100%',
    '0 0% 100%',
    '0 0% 0%',
    '0 0% 10%',
    '0 0% 100%',
    '0 0% 15%',
    '0 0% 20%'
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_themes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_themes_timestamp
  BEFORE UPDATE ON themes
  FOR EACH ROW
  EXECUTE FUNCTION update_themes_updated_at();
