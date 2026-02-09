-- Add shop hero settings to site_settings table
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS shop_hero_title TEXT DEFAULT 'Innovation is born where research lives.',
ADD COLUMN IF NOT EXISTS shop_hero_subtitle TEXT DEFAULT 'Premium quality compounds for scientific research. All products are ≥99% pure and third-party tested.';

