-- Add default_wallet_id to customers table
ALTER TABLE customers
ADD COLUMN default_wallet_id UUID REFERENCES business_wallets(id);

-- Set Main Wallet as default for all existing customers
UPDATE customers
SET default_wallet_id = (
  SELECT id FROM business_wallets 
  WHERE label = 'Main Wallet' 
  AND is_active = true 
  LIMIT 1
)
WHERE default_wallet_id IS NULL;

-- Add comment
COMMENT ON COLUMN customers.default_wallet_id IS 'Default wallet for customer payments, especially for instant payment customers';
