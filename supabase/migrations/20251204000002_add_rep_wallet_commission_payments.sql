-- Rep Wallets table (separate from business_wallets)
CREATE TABLE IF NOT EXISTS rep_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address VARCHAR(42) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ETH',
  encrypted_private_key TEXT NOT NULL,
  private_key_iv TEXT NOT NULL,
  private_key_auth_tag TEXT NOT NULL,
  encrypted_mnemonic TEXT,
  mnemonic_iv TEXT,
  mnemonic_auth_tag TEXT,
  pin_hash TEXT,
  password_hash TEXT,
  balance_eth NUMERIC(20, 10) DEFAULT 0,
  balance_usdc NUMERIC(20, 6) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rep_id, is_active) -- Only one active wallet per rep
);

-- Rep Commission Payments table (tracks crypto payments to reps)
CREATE TABLE IF NOT EXISTS rep_commission_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(id),
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USDC',
  source_wallet_id UUID REFERENCES business_wallets(id),
  recipient_address VARCHAR(42),
  transaction_hash VARCHAR(66),
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
  payment_token VARCHAR(64) UNIQUE, -- For secure report access
  access_code_hash TEXT, -- PIN to view payment report
  notes TEXT,
  error_message TEXT,
  notification_sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link table for payments to commissions
CREATE TABLE IF NOT EXISTS payment_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES rep_commission_payments(id) ON DELETE CASCADE,
  commission_id UUID NOT NULL REFERENCES rep_commissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(payment_id, commission_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rep_wallets_rep_id ON rep_wallets(rep_id);
CREATE INDEX IF NOT EXISTS idx_rep_wallets_address ON rep_wallets(address);
CREATE INDEX IF NOT EXISTS idx_rep_commission_payments_rep_id ON rep_commission_payments(rep_id);
CREATE INDEX IF NOT EXISTS idx_rep_commission_payments_token ON rep_commission_payments(payment_token);
CREATE INDEX IF NOT EXISTS idx_rep_commission_payments_status ON rep_commission_payments(status);
CREATE INDEX IF NOT EXISTS idx_payment_commissions_payment_id ON payment_commissions(payment_id);

-- Enable RLS
ALTER TABLE rep_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE rep_commission_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_commissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rep_wallets
CREATE POLICY "Reps can view own wallet" ON rep_wallets
  FOR SELECT USING (rep_id = auth.uid());

CREATE POLICY "Admins can manage rep wallets" ON rep_wallets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for rep_commission_payments
CREATE POLICY "Reps can view own payments" ON rep_commission_payments
  FOR SELECT USING (rep_id = auth.uid());

CREATE POLICY "Admins can manage commission payments" ON rep_commission_payments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for payment_commissions
CREATE POLICY "View payment commission links" ON payment_commissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM rep_commission_payments p 
      WHERE p.id = payment_id AND (p.rep_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
    )
  );

-- Comments
COMMENT ON TABLE rep_wallets IS 'Crypto wallets for sales representatives';
COMMENT ON TABLE rep_commission_payments IS 'Commission payment records with transaction details';
COMMENT ON COLUMN rep_commission_payments.payment_token IS 'Unique token for secure payment report URL';
COMMENT ON COLUMN rep_commission_payments.access_code_hash IS 'Hashed PIN code to access payment report';

