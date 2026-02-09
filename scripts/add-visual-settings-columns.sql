-- =====================================================
-- ADD VISUAL SETTINGS COLUMNS TO MAINTENANCE_SETTINGS
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Add visual effect settings columns if they don't exist
ALTER TABLE maintenance_settings 
ADD COLUMN IF NOT EXISTS pulse_style TEXT NOT NULL DEFAULT 'techno';

ALTER TABLE maintenance_settings 
ADD COLUMN IF NOT EXISTS pulse_amplitude DECIMAL(3,2) NOT NULL DEFAULT 1.0;

ALTER TABLE maintenance_settings 
ADD COLUMN IF NOT EXISTS light_radius DECIMAL(4,3) NOT NULL DEFAULT 0.875;

ALTER TABLE maintenance_settings 
ADD COLUMN IF NOT EXISTS light_concentration DECIMAL(4,3) NOT NULL DEFAULT 0.03;

ALTER TABLE maintenance_settings 
ADD COLUMN IF NOT EXISTS persistence_factor DECIMAL(4,3) NOT NULL DEFAULT 0.02;

ALTER TABLE maintenance_settings 
ADD COLUMN IF NOT EXISTS color_speed INTEGER NOT NULL DEFAULT 64;

ALTER TABLE maintenance_settings 
ADD COLUMN IF NOT EXISTS grid_scale DECIMAL(3,2) NOT NULL DEFAULT 1.0;

ALTER TABLE maintenance_settings 
ADD COLUMN IF NOT EXISTS use_color_cycle BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE maintenance_settings 
ADD COLUMN IF NOT EXISTS static_color TEXT NOT NULL DEFAULT '#505050';

-- Success message
SELECT 'Visual settings columns added successfully!' as message;

