-- Fix balance columns to support proper ETH precision (18 decimal places)

-- Drop old single balance column if it exists
ALTER TABLE business_wallets DROP COLUMN IF EXISTS balance;

-- Add separate balance columns with proper precision
ALTER TABLE business_wallets 
ADD COLUMN IF NOT EXISTS balance_eth DECIMAL(30, 18) DEFAULT 0,
ADD COLUMN IF NOT EXISTS balance_usdc DECIMAL(30, 6) DEFAULT 0;

-- Add indexes for balance queries
CREATE INDEX IF NOT EXISTS idx_business_wallets_balance_eth ON business_wallets(balance_eth);
CREATE INDEX IF NOT EXISTS idx_business_wallets_balance_usdc ON business_wallets(balance_usdc);

-- Add comments
COMMENT ON COLUMN business_wallets.balance_eth IS 'ETH balance with 18 decimal precision (Wei-compatible)';
COMMENT ON COLUMN business_wallets.balance_usdc IS 'USDC balance with 6 decimal precision (standard for USDC)';
