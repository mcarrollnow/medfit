-- Add semantic color fields to themes table
-- These are the colors that will actually be used in the UI with generic class names
-- They reference colors from the palette (yellow, red, blue, etc.)

ALTER TABLE themes ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#fff95e';
ALTER TABLE themes ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#6609ff';
ALTER TABLE themes ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#fff95e';
ALTER TABLE themes ADD COLUMN IF NOT EXISTS success_color TEXT DEFAULT '#47ff7b';
ALTER TABLE themes ADD COLUMN IF NOT EXISTS error_color TEXT DEFAULT '#e60041';
ALTER TABLE themes ADD COLUMN IF NOT EXISTS warning_color TEXT DEFAULT '#ff9845';
ALTER TABLE themes ADD COLUMN IF NOT EXISTS info_color TEXT DEFAULT '#1086ff';
ALTER TABLE themes ADD COLUMN IF NOT EXISTS link_color TEXT DEFAULT '#fff95e';

-- Add comments explaining the structure
COMMENT ON COLUMN themes.primary_color IS 'Primary brand color (buttons, CTAs) - select from palette';
COMMENT ON COLUMN themes.secondary_color IS 'Secondary brand color - select from palette';
COMMENT ON COLUMN themes.accent_color IS 'Accent highlights - select from palette';
COMMENT ON COLUMN themes.success_color IS 'Success states, checkmarks - select from palette';
COMMENT ON COLUMN themes.error_color IS 'Error states, warnings - select from palette';
COMMENT ON COLUMN themes.warning_color IS 'Warning states, alerts - select from palette';
COMMENT ON COLUMN themes.info_color IS 'Informational states - select from palette';
COMMENT ON COLUMN themes.link_color IS 'Link color - select from palette';

-- Color palette comments (these are the selectable options)
COMMENT ON COLUMN themes.yellow_primary IS 'Palette option: Yellow (#fff95e)';
COMMENT ON COLUMN themes.purple_primary IS 'Palette option: Purple (#6609ff)';
COMMENT ON COLUMN themes.red_accent IS 'Palette option: Red (#e60041)';
COMMENT ON COLUMN themes.pink_accent IS 'Palette option: Pink (#ff4dfd)';
COMMENT ON COLUMN themes.blue_accent IS 'Palette option: Blue (#1086ff)';
COMMENT ON COLUMN themes.green_accent IS 'Palette option: Green (#47ff7b)';
COMMENT ON COLUMN themes.orange_accent IS 'Palette option: Orange (#ff9845)';
COMMENT ON COLUMN themes.gray_neutral IS 'Palette option: Gray (#818181)';

-- Update existing themes with semantic mappings
UPDATE themes SET
  primary_color = yellow_primary,      -- Primary buttons = yellow
  secondary_color = purple_primary,    -- Secondary = purple  
  accent_color = yellow_primary,       -- Accents = yellow
  success_color = green_accent,        -- Success = green
  error_color = red_accent,            -- Error = red
  warning_color = orange_accent,       -- Warning = orange
  info_color = blue_accent,            -- Info = blue
  link_color = yellow_primary          -- Links = yellow
WHERE slug IN ('dark', 'light', 'custom-1', 'custom-2');
