-- Add shadow system columns to themes table
ALTER TABLE themes
ADD COLUMN IF NOT EXISTS card_shadow_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS card_shadow_color TEXT DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS card_shadow_opacity INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS card_shadow_offset_x INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS card_shadow_offset_y INTEGER DEFAULT 4,
ADD COLUMN IF NOT EXISTS card_shadow_blur INTEGER DEFAULT 6,
ADD COLUMN IF NOT EXISTS card_shadow_spread INTEGER DEFAULT 0,

ADD COLUMN IF NOT EXISTS button_shadow_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS button_shadow_color TEXT DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS button_shadow_opacity INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS button_shadow_offset_x INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS button_shadow_offset_y INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS button_shadow_blur INTEGER DEFAULT 4,
ADD COLUMN IF NOT EXISTS button_shadow_spread INTEGER DEFAULT 0;

-- Add comments
COMMENT ON COLUMN themes.card_shadow_enabled IS 'Enable/disable card shadows';
COMMENT ON COLUMN themes.card_shadow_color IS 'Hex color for card shadow';
COMMENT ON COLUMN themes.card_shadow_opacity IS 'Shadow opacity 0-100';
COMMENT ON COLUMN themes.card_shadow_offset_x IS 'Horizontal offset in pixels';
COMMENT ON COLUMN themes.card_shadow_offset_y IS 'Vertical offset in pixels';
COMMENT ON COLUMN themes.card_shadow_blur IS 'Blur radius in pixels';
COMMENT ON COLUMN themes.card_shadow_spread IS 'Spread radius in pixels';

COMMENT ON COLUMN themes.button_shadow_enabled IS 'Enable/disable button shadows';
COMMENT ON COLUMN themes.button_shadow_color IS 'Hex color for button shadow';
COMMENT ON COLUMN themes.button_shadow_opacity IS 'Shadow opacity 0-100';
COMMENT ON COLUMN themes.button_shadow_offset_x IS 'Horizontal offset in pixels';
COMMENT ON COLUMN themes.button_shadow_offset_y IS 'Vertical offset in pixels';
COMMENT ON COLUMN themes.button_shadow_blur IS 'Blur radius in pixels';
COMMENT ON COLUMN themes.button_shadow_spread IS 'Spread radius in pixels';
