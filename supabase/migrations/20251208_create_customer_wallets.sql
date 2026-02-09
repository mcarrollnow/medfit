-- Customer Wallets Table
-- Allows customers to import/create wallets and secure them with PIN/password/biometric/hardware key

CREATE TABLE IF NOT EXISTS customer_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  label VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  currency VARCHAR(20) NOT NULL,
  
  -- Encrypted private key storage
  encrypted_private_key TEXT NOT NULL,
  private_key_iv TEXT NOT NULL,
  private_key_auth_tag TEXT NOT NULL,
  
  -- Encrypted mnemonic storage (optional, for recovery)
  encrypted_mnemonic TEXT,
  mnemonic_iv TEXT,
  mnemonic_auth_tag TEXT,
  
  -- Security options (at least one required)
  pin_hash TEXT,
  password_hash TEXT,
  
  -- WebAuthn/Biometric credentials
  biometric_enabled BOOLEAN DEFAULT false,
  biometric_credential_id TEXT,
  biometric_public_key TEXT,
  biometric_counter INTEGER DEFAULT 0,
  
  -- Hardware key credentials
  hardware_key_enabled BOOLEAN DEFAULT false,
  hardware_key_credential_id TEXT,
  hardware_key_public_key TEXT,
  hardware_key_counter INTEGER DEFAULT 0,
  
  -- Wallet status
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_currency CHECK (currency IN ('ETH', 'USDC', 'USDT', 'DAI', 'MATIC', 'ARB', 'OP', 'BTC', 'LTC', 'DASH', 'XRP')),
  CONSTRAINT has_security CHECK (
    pin_hash IS NOT NULL OR 
    password_hash IS NOT NULL OR 
    biometric_enabled = true OR 
    hardware_key_enabled = true
  )
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_wallets_customer_id ON customer_wallets(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_wallets_address ON customer_wallets(address);
CREATE INDEX IF NOT EXISTS idx_customer_wallets_currency ON customer_wallets(currency);
CREATE INDEX IF NOT EXISTS idx_customer_wallets_is_primary ON customer_wallets(customer_id, is_primary) WHERE is_primary = true;

-- Unique constraint: one address per currency per customer
CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_wallets_unique_address 
ON customer_wallets(customer_id, address, currency) WHERE is_active = true;

-- RLS Policies
ALTER TABLE customer_wallets ENABLE ROW LEVEL SECURITY;

-- Customers can view their own wallets
CREATE POLICY "Customers can view own wallets"
ON customer_wallets FOR SELECT
TO authenticated
USING (
  customer_id IN (
    SELECT c.id FROM customers c
    JOIN users u ON c.user_id = u.id
    WHERE u.auth_id = auth.uid()
  )
);

-- Customers can insert their own wallets
CREATE POLICY "Customers can create own wallets"
ON customer_wallets FOR INSERT
TO authenticated
WITH CHECK (
  customer_id IN (
    SELECT c.id FROM customers c
    JOIN users u ON c.user_id = u.id
    WHERE u.auth_id = auth.uid()
  )
);

-- Customers can update their own wallets
CREATE POLICY "Customers can update own wallets"
ON customer_wallets FOR UPDATE
TO authenticated
USING (
  customer_id IN (
    SELECT c.id FROM customers c
    JOIN users u ON c.user_id = u.id
    WHERE u.auth_id = auth.uid()
  )
)
WITH CHECK (
  customer_id IN (
    SELECT c.id FROM customers c
    JOIN users u ON c.user_id = u.id
    WHERE u.auth_id = auth.uid()
  )
);

-- Customers can delete their own wallets
CREATE POLICY "Customers can delete own wallets"
ON customer_wallets FOR DELETE
TO authenticated
USING (
  customer_id IN (
    SELECT c.id FROM customers c
    JOIN users u ON c.user_id = u.id
    WHERE u.auth_id = auth.uid()
  )
);

-- Admins can manage all customer wallets
CREATE POLICY "Admins can manage all customer wallets"
ON customer_wallets FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_id = auth.uid() 
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Service role full access
CREATE POLICY "Service role customer_wallets"
ON customer_wallets FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Function to ensure only one primary wallet per customer per currency
CREATE OR REPLACE FUNCTION ensure_single_primary_wallet()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE customer_wallets 
    SET is_primary = false 
    WHERE customer_id = NEW.customer_id 
      AND currency = NEW.currency 
      AND id != NEW.id 
      AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for primary wallet management
DROP TRIGGER IF EXISTS trigger_ensure_single_primary_wallet ON customer_wallets;
CREATE TRIGGER trigger_ensure_single_primary_wallet
BEFORE INSERT OR UPDATE ON customer_wallets
FOR EACH ROW
EXECUTE FUNCTION ensure_single_primary_wallet();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_customer_wallet_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_customer_wallet_timestamp ON customer_wallets;
CREATE TRIGGER trigger_update_customer_wallet_timestamp
BEFORE UPDATE ON customer_wallets
FOR EACH ROW
EXECUTE FUNCTION update_customer_wallet_timestamp();

-- Customer wallet transactions table (for tracking purchases)
CREATE TABLE IF NOT EXISTS customer_wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_wallet_id UUID NOT NULL REFERENCES customer_wallets(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  -- Transaction details
  type VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'deposit', 'withdrawal', 'refund')),
  amount DECIMAL(20, 8) NOT NULL,
  currency VARCHAR(20) NOT NULL,
  
  -- Blockchain transaction
  tx_hash VARCHAR(255),
  from_address VARCHAR(255),
  to_address VARCHAR(255),
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'cancelled')),
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS idx_customer_wallet_transactions_wallet_id ON customer_wallet_transactions(customer_wallet_id);
CREATE INDEX IF NOT EXISTS idx_customer_wallet_transactions_order_id ON customer_wallet_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_customer_wallet_transactions_status ON customer_wallet_transactions(status);
CREATE INDEX IF NOT EXISTS idx_customer_wallet_transactions_tx_hash ON customer_wallet_transactions(tx_hash);

-- RLS for transactions
ALTER TABLE customer_wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Customers can view their own transactions
CREATE POLICY "Customers can view own wallet transactions"
ON customer_wallet_transactions FOR SELECT
TO authenticated
USING (
  customer_wallet_id IN (
    SELECT cw.id FROM customer_wallets cw
    JOIN customers c ON cw.customer_id = c.id
    JOIN users u ON c.user_id = u.id
    WHERE u.auth_id = auth.uid()
  )
);

-- Admins can manage all wallet transactions
CREATE POLICY "Admins can manage all wallet transactions"
ON customer_wallet_transactions FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_id = auth.uid() 
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Service role full access
CREATE POLICY "Service role customer_wallet_transactions"
ON customer_wallet_transactions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

