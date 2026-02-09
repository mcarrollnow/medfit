-- Add typography and spacing controls to themes table

-- Font sizes (in rem or px)
ALTER TABLE themes
  ADD COLUMN IF NOT EXISTS font_size_xs TEXT DEFAULT '0.75rem',
  ADD COLUMN IF NOT EXISTS font_size_sm TEXT DEFAULT '0.875rem',
  ADD COLUMN IF NOT EXISTS font_size_base TEXT DEFAULT '1rem',
  ADD COLUMN IF NOT EXISTS font_size_lg TEXT DEFAULT '1.125rem',
  ADD COLUMN IF NOT EXISTS font_size_xl TEXT DEFAULT '1.25rem',
  ADD COLUMN IF NOT EXISTS font_size_2xl TEXT DEFAULT '1.5rem',
  ADD COLUMN IF NOT EXISTS font_size_3xl TEXT DEFAULT '1.875rem';

-- Font weights
ALTER TABLE themes
  ADD COLUMN IF NOT EXISTS font_weight_light TEXT DEFAULT '300',
  ADD COLUMN IF NOT EXISTS font_weight_normal TEXT DEFAULT '400',
  ADD COLUMN IF NOT EXISTS font_weight_medium TEXT DEFAULT '500',
  ADD COLUMN IF NOT EXISTS font_weight_semibold TEXT DEFAULT '600',
  ADD COLUMN IF NOT EXISTS font_weight_bold TEXT DEFAULT '700';

-- Border sizes (in px)
ALTER TABLE themes
  ADD COLUMN IF NOT EXISTS border_width_thin TEXT DEFAULT '1px',
  ADD COLUMN IF NOT EXISTS border_width_default TEXT DEFAULT '2px',
  ADD COLUMN IF NOT EXISTS border_width_thick TEXT DEFAULT '3px',
  ADD COLUMN IF NOT EXISTS border_width_heavy TEXT DEFAULT '4px';

-- Border radius
ALTER TABLE themes
  ADD COLUMN IF NOT EXISTS border_radius_sm TEXT DEFAULT '0.25rem',
  ADD COLUMN IF NOT EXISTS border_radius_md TEXT DEFAULT '0.5rem',
  ADD COLUMN IF NOT EXISTS border_radius_lg TEXT DEFAULT '0.75rem',
  ADD COLUMN IF NOT EXISTS border_radius_xl TEXT DEFAULT '1rem',
  ADD COLUMN IF NOT EXISTS border_radius_2xl TEXT DEFAULT '1.5rem';

-- Spacing scale
ALTER TABLE themes
  ADD COLUMN IF NOT EXISTS spacing_xs TEXT DEFAULT '0.25rem',
  ADD COLUMN IF NOT EXISTS spacing_sm TEXT DEFAULT '0.5rem',
  ADD COLUMN IF NOT EXISTS spacing_md TEXT DEFAULT '1rem',
  ADD COLUMN IF NOT EXISTS spacing_lg TEXT DEFAULT '1.5rem',
  ADD COLUMN IF NOT EXISTS spacing_xl TEXT DEFAULT '2rem';
