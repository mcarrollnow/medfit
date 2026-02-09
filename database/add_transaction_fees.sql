-- Add gas fee tracking fields and USD values to wallet_transactions table
ALTER TABLE wallet_transactions
  ADD COLUMN IF NOT EXISTS gas_used BIGINT,
  ADD COLUMN IF NOT EXISTS gas_price TEXT,
  ADD COLUMN IF NOT EXISTS transaction_fee TEXT,
  ADD COLUMN IF NOT EXISTS amount_usd DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS transaction_fee_usd DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS eth_price_usd DECIMAL(10, 2);

-- Add comments explaining the fields
COMMENT ON COLUMN wallet_transactions.gas_used IS 'Amount of gas used in the transaction';
COMMENT ON COLUMN wallet_transactions.gas_price IS 'Gas price in Wei';
COMMENT ON COLUMN wallet_transactions.transaction_fee IS 'Total transaction fee in ETH (gas_used * gas_price)';
COMMENT ON COLUMN wallet_transactions.amount_usd IS 'Transaction amount in USD at time of transaction';
COMMENT ON COLUMN wallet_transactions.transaction_fee_usd IS 'Transaction fee in USD at time of transaction';
COMMENT ON COLUMN wallet_transactions.eth_price_usd IS 'ETH price in USD at time of transaction';
