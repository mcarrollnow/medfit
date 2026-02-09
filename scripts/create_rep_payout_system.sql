-- Rep Commissions and Payouts System
-- Run this SQL to create the tables for rep commission tracking and payouts

-- 1. Rep Commissions Table - tracks commission per order
CREATE TABLE IF NOT EXISTS rep_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  commission_rate DECIMAL(5,4) NOT NULL DEFAULT 0.10,
  commission_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'used', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rep_id, order_id)
);

-- 2. Rep Payouts Table - tracks payout transactions
CREATE TABLE IF NOT EXISTS rep_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('crypto', 'bank_transfer', 'check', 'cash', 'store_credit', 'other')),
  crypto_currency VARCHAR(20), -- e.g., 'USDT', 'BTC', 'ETH'
  wallet_address TEXT, -- rep's wallet address for crypto payouts
  transaction_hash TEXT, -- blockchain transaction hash
  transaction_number VARCHAR(100), -- for bank transfers, check numbers, etc.
  receipt_url TEXT, -- URL to uploaded receipt file
  notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  processed_by UUID REFERENCES users(id), -- admin who processed the payout
  processed_at TIMESTAMP WITH TIME ZONE,
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Rep Store Purchases - tracks when reps use commission for store purchases
CREATE TABLE IF NOT EXISTS rep_store_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  commission_used DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Link commissions to payouts (many-to-many)
CREATE TABLE IF NOT EXISTS payout_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_id UUID NOT NULL REFERENCES rep_payouts(id) ON DELETE CASCADE,
  commission_id UUID NOT NULL REFERENCES rep_commissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(payout_id, commission_id)
);

-- Add rep wallet addresses to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS crypto_wallet_address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_payment_type VARCHAR(50) DEFAULT 'crypto';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rep_commissions_rep_id ON rep_commissions(rep_id);
CREATE INDEX IF NOT EXISTS idx_rep_commissions_status ON rep_commissions(status);
CREATE INDEX IF NOT EXISTS idx_rep_payouts_rep_id ON rep_payouts(rep_id);
CREATE INDEX IF NOT EXISTS idx_rep_payouts_status ON rep_payouts(status);
CREATE INDEX IF NOT EXISTS idx_rep_store_purchases_rep_id ON rep_store_purchases(rep_id);

-- Trigger to auto-create commission record when order is placed by rep's customer
CREATE OR REPLACE FUNCTION create_rep_commission()
RETURNS TRIGGER AS $$
DECLARE
  v_rep_id UUID;
  v_commission_rate DECIMAL(5,4) := 0.10;
BEGIN
  -- Get the rep assigned to this customer
  SELECT rep_id INTO v_rep_id 
  FROM customer_rep_assignments 
  WHERE customer_id = NEW.customer_id 
    AND is_current = TRUE
  LIMIT 1;
  
  -- If customer has a rep, create commission record
  IF v_rep_id IS NOT NULL THEN
    INSERT INTO rep_commissions (rep_id, order_id, order_total, commission_rate, commission_amount)
    VALUES (
      v_rep_id,
      NEW.id,
      COALESCE(NEW.total_amount, 0),
      v_commission_rate,
      COALESCE(NEW.total_amount, 0) * v_commission_rate
    )
    ON CONFLICT (rep_id, order_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on orders table
DROP TRIGGER IF EXISTS on_order_create_commission ON orders;
CREATE TRIGGER on_order_create_commission
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION create_rep_commission();

-- Trigger to update commission when order status changes
CREATE OR REPLACE FUNCTION update_commission_on_order_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    UPDATE rep_commissions 
    SET status = 'cancelled', updated_at = NOW()
    WHERE order_id = NEW.id AND status = 'pending';
  ELSIF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    UPDATE rep_commissions 
    SET status = 'approved', updated_at = NOW()
    WHERE order_id = NEW.id AND status = 'pending';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_order_status_update_commission ON orders;
CREATE TRIGGER on_order_status_update_commission
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_commission_on_order_status();

-- Show created tables
SELECT 'Tables created successfully' as result;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('rep_commissions', 'rep_payouts', 'rep_store_purchases', 'payout_commissions')
ORDER BY table_name;

