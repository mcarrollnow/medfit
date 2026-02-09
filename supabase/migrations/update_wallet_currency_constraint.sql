-- Update business_wallets currency constraint to support new tokens
-- Drop the old constraint
ALTER TABLE business_wallets 
  DROP CONSTRAINT IF EXISTS business_wallets_currency_check;

-- Add new constraint with all supported tokens
ALTER TABLE business_wallets 
  ADD CONSTRAINT business_wallets_currency_check 
  CHECK (currency IN ('ETH', 'USDC', 'USDT', 'DAI', 'MATIC', 'ARB', 'OP', 'BTC'));

-- Comment for clarity
COMMENT ON CONSTRAINT business_wallets_currency_check ON business_wallets IS 
  'Supported cryptocurrencies: ETH (Ethereum), USDC (USD Coin), USDT (Tether), DAI (Dai Stablecoin), MATIC (Polygon), ARB (Arbitrum), OP (Optimism), BTC (Bitcoin)';
