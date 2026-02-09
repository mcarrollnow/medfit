-- Add payment_metadata column to orders for storing wallet addresses, gas fees, etc.
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_metadata JSONB DEFAULT '{}';

-- Add comment describing the column
COMMENT ON COLUMN orders.payment_metadata IS 'Stores payment details: from_wallet, to_wallet, gas_fee_eth, gas_fee_usd, eth_price';

