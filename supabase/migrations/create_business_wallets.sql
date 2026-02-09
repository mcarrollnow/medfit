-- Create business_wallets table for crypto wallet management
CREATE TABLE IF NOT EXISTS business_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_name VARCHAR(255) NOT NULL,
  wallet_address VARCHAR(255) NOT NULL UNIQUE,
  currency VARCHAR(10) NOT NULL DEFAULT 'ETH',
  balance DECIMAL(20, 8) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_business_wallets_active ON business_wallets(is_active);
CREATE INDEX IF NOT EXISTS idx_business_wallets_currency ON business_wallets(currency);

-- Create wallet_transactions table for tracking all transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES business_wallets(id) ON DELETE CASCADE,
  transaction_hash VARCHAR(255) UNIQUE,
  transaction_type VARCHAR(50) NOT NULL, -- 'incoming', 'outgoing', 'internal'
  amount DECIMAL(20, 8) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  from_address VARCHAR(255),
  to_address VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
  confirmations INTEGER DEFAULT 0,
  gas_used DECIMAL(20, 8),
  gas_price DECIMAL(20, 8),
  block_number BIGINT,
  block_timestamp TIMESTAMPTZ,
  order_id UUID REFERENCES orders(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for wallet_transactions
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_hash ON wallet_transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_order ON wallet_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_status ON wallet_transactions(status);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(transaction_type);

-- Add RLS policies for business_wallets
ALTER TABLE business_wallets ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can view all wallets"
  ON business_wallets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert wallets"
  ON business_wallets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update wallets"
  ON business_wallets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete wallets"
  ON business_wallets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Add RLS policies for wallet_transactions
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions"
  ON wallet_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert transactions"
  ON wallet_transactions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update transactions"
  ON wallet_transactions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_wallet_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for business_wallets
CREATE TRIGGER update_business_wallets_updated_at
  BEFORE UPDATE ON business_wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_updated_at();

-- Trigger for wallet_transactions
CREATE TRIGGER update_wallet_transactions_updated_at
  BEFORE UPDATE ON wallet_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_updated_at();

-- Add comments for clarity
COMMENT ON TABLE business_wallets IS 'Stores business crypto wallet addresses for receiving payments';
COMMENT ON TABLE wallet_transactions IS 'Tracks all incoming and outgoing crypto transactions';
COMMENT ON COLUMN wallet_transactions.transaction_type IS 'Type: incoming (customer payment), outgoing (withdrawal), internal (transfer)';
COMMENT ON COLUMN wallet_transactions.status IS 'Status: pending (unconfirmed), confirmed (on blockchain), failed';
