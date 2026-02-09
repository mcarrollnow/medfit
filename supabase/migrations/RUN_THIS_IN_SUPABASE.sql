-- ============================================
-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- Go to: Supabase Dashboard > SQL Editor > New Query
-- Paste this entire script and click "Run"
-- ============================================

-- 1. Add rep discount code creation permission to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS can_create_discount_codes BOOLEAN DEFAULT false;

-- 2. Add rep fields to discount_codes table
ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS created_by_rep_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS assigned_rep_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- 3. Create indexes for faster rep discount code lookups
CREATE INDEX IF NOT EXISTS idx_discount_codes_created_by_rep ON discount_codes(created_by_rep_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_assigned_rep ON discount_codes(assigned_rep_id);

-- 4. Create table for customer-assigned discounts that auto-apply at checkout
CREATE TABLE IF NOT EXISTS customer_assigned_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  
  -- The discount can be linked to an existing discount code OR be a one-time custom discount
  discount_code_id UUID REFERENCES discount_codes(id) ON DELETE CASCADE,
  
  -- For custom one-time discounts (when discount_code_id is null)
  custom_discount_type VARCHAR(20) CHECK (custom_discount_type IN ('percentage', 'fixed')),
  custom_discount_value DECIMAL(10,2),
  custom_description TEXT,
  
  -- Who assigned this discount
  assigned_by_rep_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_by_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Status and usage tracking
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'removed')),
  used_on_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  -- Validity
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  removed_at TIMESTAMP WITH TIME ZONE,
  removed_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Notes
  notes TEXT
);

-- 5. Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_customer_assigned_discounts_customer ON customer_assigned_discounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_assigned_discounts_status ON customer_assigned_discounts(status);
CREATE INDEX IF NOT EXISTS idx_customer_assigned_discounts_active ON customer_assigned_discounts(customer_id, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_customer_assigned_discounts_rep ON customer_assigned_discounts(assigned_by_rep_id);

-- Done! You should see "Success. No rows returned" if everything worked.

