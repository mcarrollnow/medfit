-- Add free shipping option to discount codes
ALTER TABLE discount_codes 
ADD COLUMN IF NOT EXISTS free_shipping BOOLEAN DEFAULT FALSE;

-- Add comment for clarity
COMMENT ON COLUMN discount_codes.free_shipping IS 'If true, this discount code provides free shipping';
