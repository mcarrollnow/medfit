-- Rep Pricing Tiers + Per-Customer Product Overrides
-- Reps create tiers (Gold/Silver/Bronze) with base discount %, assign customers to tiers,
-- and override specific product prices for specific customers.

-- 1. Create rep_pricing_tiers table
CREATE TABLE IF NOT EXISTS rep_pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  discount_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for rep lookup
CREATE INDEX IF NOT EXISTS idx_rep_pricing_tiers_rep_id ON rep_pricing_tiers(rep_id);

-- 2. Add pricing_tier_id to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS pricing_tier_id UUID REFERENCES rep_pricing_tiers(id) ON DELETE SET NULL;

-- Index for tier lookup
CREATE INDEX IF NOT EXISTS idx_customers_pricing_tier_id ON customers(pricing_tier_id);

-- 3. Create customer_product_pricing table (per-customer per-product overrides)
CREATE TABLE IF NOT EXISTS customer_product_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  custom_price DECIMAL(10,2) NOT NULL,
  set_by_rep_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(customer_id, product_id)
);

-- Indexes for customer_product_pricing
CREATE INDEX IF NOT EXISTS idx_customer_product_pricing_customer ON customer_product_pricing(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_product_pricing_product ON customer_product_pricing(product_id);

-- 4. RLS Policies

-- Enable RLS
ALTER TABLE rep_pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_product_pricing ENABLE ROW LEVEL SECURITY;

-- Rep pricing tiers: reps can manage their own tiers
CREATE POLICY "Reps can view own tiers"
  ON rep_pricing_tiers FOR SELECT
  USING (rep_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Reps can insert own tiers"
  ON rep_pricing_tiers FOR INSERT
  WITH CHECK (rep_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Reps can update own tiers"
  ON rep_pricing_tiers FOR UPDATE
  USING (rep_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Reps can delete own tiers"
  ON rep_pricing_tiers FOR DELETE
  USING (rep_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Admins can see all tiers
CREATE POLICY "Admins can view all tiers"
  ON rep_pricing_tiers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- Customer product pricing: reps can manage pricing for their assigned customers
CREATE POLICY "Reps can view own customer pricing"
  ON customer_product_pricing FOR SELECT
  USING (set_by_rep_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Reps can insert customer pricing"
  ON customer_product_pricing FOR INSERT
  WITH CHECK (set_by_rep_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Reps can update customer pricing"
  ON customer_product_pricing FOR UPDATE
  USING (set_by_rep_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Reps can delete customer pricing"
  ON customer_product_pricing FOR DELETE
  USING (set_by_rep_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Admins can see all customer pricing
CREATE POLICY "Admins can view all customer pricing"
  ON customer_product_pricing FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- Service role bypass for server-side operations
CREATE POLICY "Service role full access tiers"
  ON rep_pricing_tiers FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access customer pricing"
  ON customer_product_pricing FOR ALL
  USING (auth.role() = 'service_role');

-- 5. Ensure only one default tier per rep
CREATE OR REPLACE FUNCTION ensure_single_default_tier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE rep_pricing_tiers
    SET is_default = false, updated_at = now()
    WHERE rep_id = NEW.rep_id AND id != NEW.id AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ensure_single_default_tier
  BEFORE INSERT OR UPDATE ON rep_pricing_tiers
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_tier();

-- 6. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_rep_pricing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_rep_pricing_tiers_updated_at
  BEFORE UPDATE ON rep_pricing_tiers
  FOR EACH ROW
  EXECUTE FUNCTION update_rep_pricing_updated_at();

CREATE TRIGGER trg_customer_product_pricing_updated_at
  BEFORE UPDATE ON customer_product_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_rep_pricing_updated_at();
