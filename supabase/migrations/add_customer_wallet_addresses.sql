-- Add wallet addresses tracking to customers table
-- This allows us to save customer wallet addresses when they make crypto payments

-- Add wallet_addresses column to customers table (JSONB array to store multiple addresses)
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS wallet_addresses JSONB DEFAULT '[]'::jsonb;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_wallet_addresses 
ON customers USING GIN (wallet_addresses);

-- Add comment explaining the column
COMMENT ON COLUMN customers.wallet_addresses IS 'Array of wallet addresses used by customer for payments. Format: [{"address": "0x...", "last_used": "2025-10-14T...", "order_id": "..."}]';
