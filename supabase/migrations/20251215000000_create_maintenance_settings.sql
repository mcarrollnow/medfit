-- Create maintenance_settings table
CREATE TABLE IF NOT EXISTS maintenance_settings (
  id TEXT PRIMARY KEY DEFAULT '1',
  enabled BOOLEAN NOT NULL DEFAULT false,
  -- Text Settings
  title TEXT NOT NULL DEFAULT 'Under Maintenance',
  subtitle TEXT DEFAULT 'We''ll be back soon',
  font_size INTEGER NOT NULL DEFAULT 72,
  font_weight TEXT NOT NULL DEFAULT '700',
  font_style TEXT NOT NULL DEFAULT 'normal',
  text_color TEXT NOT NULL DEFAULT '#FFFFFF',
  show_subtitle BOOLEAN NOT NULL DEFAULT true,
  subtitle_font_size INTEGER NOT NULL DEFAULT 24,
  -- Visual Effect Settings
  pulse_style TEXT NOT NULL DEFAULT 'techno',
  pulse_amplitude DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  light_radius DECIMAL(4,3) NOT NULL DEFAULT 0.875,
  light_concentration DECIMAL(4,3) NOT NULL DEFAULT 0.03,
  persistence_factor DECIMAL(4,3) NOT NULL DEFAULT 0.02,
  color_speed INTEGER NOT NULL DEFAULT 64,
  grid_scale DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  use_color_cycle BOOLEAN NOT NULL DEFAULT true,
  static_color TEXT NOT NULL DEFAULT '#505050',
  -- Timestamps
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row
INSERT INTO maintenance_settings (id, enabled, title, subtitle)
VALUES ('1', false, 'Under Maintenance', 'We''ll be back soon')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE maintenance_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read (needed for middleware to check maintenance status)
CREATE POLICY "Allow public read of maintenance settings"
  ON maintenance_settings
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated admin users to update
CREATE POLICY "Allow admin update of maintenance settings"
  ON maintenance_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE maintenance_settings IS 'Stores maintenance mode settings for the site';
