-- Add crypto payment tracking fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS assigned_wallet_id UUID REFERENCES business_wallets(id),
ADD COLUMN IF NOT EXISTS expected_payment_amount DECIMAL(20, 8),
ADD COLUMN IF NOT EXISTS expected_payment_currency VARCHAR(10),
ADD COLUMN IF NOT EXISTS transaction_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_initiated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_failed_reason TEXT;

-- Create index for faster payment lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_wallet ON orders(assigned_wallet_id);
CREATE INDEX IF NOT EXISTS idx_orders_transaction_hash ON orders(transaction_hash);

-- Add comments for clarity
COMMENT ON COLUMN orders.payment_status IS 'Payment status: pending, payment_processing, paid, failed';
COMMENT ON COLUMN orders.payment_method IS 'Payment method: ethereum, usdc, bitcoin, etc.';
COMMENT ON COLUMN orders.assigned_wallet_id IS 'Business wallet assigned to receive this payment';
COMMENT ON COLUMN orders.expected_payment_amount IS 'Exact amount expected for payment verification';
COMMENT ON COLUMN orders.expected_payment_currency IS 'Currency expected (ETH, USDC, etc.)';
COMMENT ON COLUMN orders.transaction_hash IS 'Blockchain transaction hash once payment is verified';
COMMENT ON COLUMN orders.payment_initiated_at IS 'When customer clicked pay button';
COMMENT ON COLUMN orders.payment_verified_at IS 'When payment was confirmed on blockchain';
COMMENT ON COLUMN orders.payment_failed_reason IS 'Reason for payment failure (insufficient funds, timeout, etc.)';
