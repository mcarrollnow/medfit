-- Create table for customer-assigned discounts that auto-apply at checkout
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

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_customer_assigned_discounts_customer ON customer_assigned_discounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_assigned_discounts_status ON customer_assigned_discounts(status);
CREATE INDEX IF NOT EXISTS idx_customer_assigned_discounts_active ON customer_assigned_discounts(customer_id, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_customer_assigned_discounts_rep ON customer_assigned_discounts(assigned_by_rep_id);

-- Comments
COMMENT ON TABLE customer_assigned_discounts IS 'Discounts assigned to customers that auto-apply at checkout';
COMMENT ON COLUMN customer_assigned_discounts.discount_code_id IS 'Link to existing discount code, or null for custom one-time discounts';
COMMENT ON COLUMN customer_assigned_discounts.custom_discount_type IS 'For custom discounts: percentage or fixed amount';
COMMENT ON COLUMN customer_assigned_discounts.custom_discount_value IS 'For custom discounts: the discount value';
COMMENT ON COLUMN customer_assigned_discounts.status IS 'active=ready to use, used=applied to order, expired=past expiry, removed=manually removed';

