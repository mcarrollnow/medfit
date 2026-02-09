-- Add custom referral discount field to customers table
-- This allows admins to set a custom discount percentage for individual customer referral codes
-- If null, the default 15% discount is used

ALTER TABLE customers
ADD COLUMN IF NOT EXISTS custom_referral_discount INTEGER DEFAULT NULL;

-- Add a comment explaining the field
COMMENT ON COLUMN customers.custom_referral_discount IS 'Custom referral discount percentage. If NULL, uses default 15%. Range: 1-100.';

-- Add a check constraint to ensure valid discount range
ALTER TABLE customers
ADD CONSTRAINT custom_referral_discount_range
CHECK (custom_referral_discount IS NULL OR (custom_referral_discount >= 1 AND custom_referral_discount <= 100));
