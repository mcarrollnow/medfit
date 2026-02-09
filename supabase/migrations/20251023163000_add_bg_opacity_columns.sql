-- Add opacity columns for primary and secondary backgrounds
ALTER TABLE themes
ADD COLUMN IF NOT EXISTS bg_primary_opacity INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS bg_secondary_opacity INTEGER DEFAULT 100;

-- Add comments for documentation
COMMENT ON COLUMN themes.bg_primary_opacity IS 'Opacity percentage (0-100) for primary background color';
COMMENT ON COLUMN themes.bg_secondary_opacity IS 'Opacity percentage (0-100) for secondary background color';
