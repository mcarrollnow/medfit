-- Add confirmed_at column to wallet_transactions
ALTER TABLE wallet_transactions 
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;

-- Add index for confirmed transactions
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_confirmed_at 
  ON wallet_transactions(confirmed_at);

-- Add comment
COMMENT ON COLUMN wallet_transactions.confirmed_at IS 'Timestamp when the transaction was confirmed on the blockchain';
