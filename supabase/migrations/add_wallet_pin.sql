-- Add PIN hash column to business_wallets table
ALTER TABLE business_wallets
ADD COLUMN pin_hash TEXT;

-- Add index for better query performance
CREATE INDEX idx_business_wallets_pin_hash ON business_wallets(pin_hash) WHERE pin_hash IS NOT NULL;

-- Add comment
COMMENT ON COLUMN business_wallets.pin_hash IS 'Hashed PIN for wallet protection (optional)';
