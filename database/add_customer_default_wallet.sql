-- Add default_wallet_id column to customers table
-- This allows each customer to have a default wallet for payments

ALTER TABLE customers
ADD COLUMN IF NOT EXISTS default_wallet_id UUID REFERENCES business_wallets(id);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_default_wallet ON customers(default_wallet_id);

-- Add comment
COMMENT ON COLUMN customers.default_wallet_id IS 'Default business wallet assigned to this customer for receiving payments';

-- Now set the retail wallet as default for all retail customers
UPDATE customers
SET default_wallet_id = (
  SELECT id FROM business_wallets 
  WHERE address = '0xC1EF45305Eff067203322518Bd80b5B08f65f294' 
  LIMIT 1
)
WHERE customer_type IN ('retail', 'retailvip')
AND default_wallet_id IS NULL;

-- Set as column default for future retail customers (commented out - needs trigger for dynamic)
-- ALTER TABLE customers 
-- ALTER COLUMN default_wallet_id SET DEFAULT (
--   SELECT id FROM business_wallets 
--   WHERE address = '0xC1EF45305Eff067203322518Bd80b5B08f65f294' 
--   LIMIT 1
-- );
