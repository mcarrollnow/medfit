-- Set default wallet for all retail customers
-- First, get the wallet ID for address 0xC1EF45305Eff067203322518Bd80b5B08f65f294

-- Update all retail customers to use this wallet
UPDATE customers
SET default_wallet_id = (
  SELECT id FROM business_wallets 
  WHERE address = '0xC1EF45305Eff067203322518Bd80b5B08f65f294' 
  LIMIT 1
)
WHERE class IN ('retail', 'retailvip')
AND default_wallet_id IS NULL;

-- Optionally, set this as the default for the column itself (for new retail customers)
ALTER TABLE customers 
ALTER COLUMN default_wallet_id SET DEFAULT (
  SELECT id FROM business_wallets 
  WHERE address = '0xC1EF45305Eff067203322518Bd80b5B08f65f294' 
  LIMIT 1
);
