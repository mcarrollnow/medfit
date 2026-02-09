-- Business Wallets Table
-- Stores your business crypto wallets with encrypted private keys
CREATE TABLE IF NOT EXISTS business_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  address TEXT NOT NULL UNIQUE,
  currency TEXT NOT NULL CHECK (currency IN ('ETH', 'USDC', 'BTC')),
  encrypted_private_key TEXT NOT NULL,
  private_key_iv TEXT NOT NULL,
  private_key_auth_tag TEXT NOT NULL,
  encrypted_mnemonic TEXT,
  mnemonic_iv TEXT,
  mnemonic_auth_tag TEXT,
  is_active BOOLEAN DEFAULT true,
  balance_eth TEXT DEFAULT '0',
  balance_usdc TEXT DEFAULT '0',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet Transactions Table
-- Records all incoming and outgoing transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES business_wallets(id) ON DELETE CASCADE,
  tx_hash TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('incoming', 'outgoing')),
  from_address TEXT,
  to_address TEXT,
  amount TEXT NOT NULL,
  currency TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  block_number BIGINT,
  order_id UUID,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_business_wallets_currency ON business_wallets(currency);
CREATE INDEX IF NOT EXISTS idx_business_wallets_active ON business_wallets(is_active);
CREATE INDEX IF NOT EXISTS idx_business_wallets_address ON business_wallets(address);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_tx_hash ON wallet_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_order_id ON wallet_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_status ON wallet_transactions(status);

-- RLS Policies for business_wallets
ALTER TABLE business_wallets ENABLE ROW LEVEL SECURITY;

-- Admin can view all wallets (but only through service role for security)
CREATE POLICY "Admin full access to business_wallets" ON business_wallets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for wallet_transactions
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Admin can view all transactions
CREATE POLICY "Admin full access to wallet_transactions" ON wallet_transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_business_wallets_updated_at
  BEFORE UPDATE ON business_wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
