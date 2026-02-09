-- Add background image and overlay fields to themes table
ALTER TABLE themes
ADD COLUMN IF NOT EXISTS background_image TEXT,
ADD COLUMN IF NOT EXISTS overlay_color TEXT DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS overlay_opacity INTEGER DEFAULT 75;

-- Add comment for documentation
COMMENT ON COLUMN themes.background_image IS 'URL to background image stored in Supabase Storage';
COMMENT ON COLUMN themes.overlay_color IS 'Hex color code for background overlay';
COMMENT ON COLUMN themes.overlay_opacity IS 'Opacity percentage (0-100) for background overlay';
