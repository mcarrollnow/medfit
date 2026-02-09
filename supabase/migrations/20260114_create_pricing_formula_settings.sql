-- ============================================
-- PRICING FORMULA SETTINGS
-- Protects cost, guarantees profit, and calculates
-- rep commission on the markup above minimum price
-- ============================================

-- Create the pricing formula settings table
CREATE TABLE IF NOT EXISTS pricing_formula_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Formula name for identification
  name TEXT NOT NULL DEFAULT 'Default Formula',
  
  -- Minimum markup multiplier (e.g., 2.0 = 2x cost = 100% profit minimum)
  -- This is the price floor - profit below this is NEVER touched
  min_markup_multiplier DECIMAL(5,2) NOT NULL DEFAULT 2.0,
  
  -- Maximum markup multiplier (e.g., 4.0 = 4x cost)
  -- This is the ceiling for commission calculation
  max_markup_multiplier DECIMAL(5,2) NOT NULL DEFAULT 4.0,
  
  -- Whether this is the active formula
  is_active BOOLEAN NOT NULL DEFAULT false,
  
  -- Description for admin reference
  description TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create index for quick active formula lookup
CREATE INDEX IF NOT EXISTS idx_pricing_formula_active ON pricing_formula_settings(is_active) WHERE is_active = true;

-- Insert default formula
INSERT INTO pricing_formula_settings (name, min_markup_multiplier, max_markup_multiplier, is_active, description)
VALUES (
  'Default Pricing Formula',
  2.0,
  4.0,
  true,
  'Default formula: Cost is protected, 2x cost is minimum price (100% profit floor), commission pool is between 2x-4x cost. Discounts reduce rep commission.'
) ON CONFLICT DO NOTHING;

-- Create a table to track pricing details on each order for transparency
CREATE TABLE IF NOT EXISTS order_pricing_breakdown (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Pricing breakdown per order
  total_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  minimum_price DECIMAL(10,2) NOT NULL DEFAULT 0,  -- Cost × min_markup
  maximum_price DECIMAL(10,2) NOT NULL DEFAULT 0,  -- Cost × max_markup
  actual_sale_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Commission calculation
  commission_pool DECIMAL(10,2) NOT NULL DEFAULT 0,  -- Sale price - minimum price (capped at max - min)
  discount_applied DECIMAL(10,2) NOT NULL DEFAULT 0,
  commission_after_discount DECIMAL(10,2) NOT NULL DEFAULT 0,  -- Commission pool - discount
  rep_commission_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  rep_commission_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Reference to the formula used
  formula_id UUID REFERENCES pricing_formula_settings(id),
  min_markup_used DECIMAL(5,2) NOT NULL DEFAULT 2.0,
  max_markup_used DECIMAL(5,2) NOT NULL DEFAULT 4.0,
  
  -- Metadata
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for order lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_order_pricing_order_id ON order_pricing_breakdown(order_id);

-- RLS Policies
ALTER TABLE pricing_formula_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_pricing_breakdown ENABLE ROW LEVEL SECURITY;

-- Admin can read/write pricing formula settings
CREATE POLICY "Admin can manage pricing formulas" ON pricing_formula_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Authenticated users can read active formula (for display purposes)
CREATE POLICY "Authenticated users can read active formula" ON pricing_formula_settings
  FOR SELECT USING (is_active = true AND auth.role() = 'authenticated');

-- Admin can view all pricing breakdowns
CREATE POLICY "Admin can view pricing breakdowns" ON order_pricing_breakdown
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Reps can view pricing breakdowns for their orders
CREATE POLICY "Reps can view own order pricing" ON order_pricing_breakdown
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN customer_rep_assignments cra ON cra.customer_id = o.customer_id
      WHERE o.id = order_pricing_breakdown.order_id
      AND cra.rep_id = auth.uid()
      AND cra.is_current = true
    )
  );

-- Function to ensure only one active formula
CREATE OR REPLACE FUNCTION ensure_single_active_formula()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE pricing_formula_settings
    SET is_active = false, updated_at = NOW()
    WHERE id != NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce single active formula
DROP TRIGGER IF EXISTS ensure_single_active_formula_trigger ON pricing_formula_settings;
CREATE TRIGGER ensure_single_active_formula_trigger
  BEFORE INSERT OR UPDATE ON pricing_formula_settings
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION ensure_single_active_formula();

-- Comments for documentation
COMMENT ON TABLE pricing_formula_settings IS 'Stores pricing formula configuration. Cost is protected, min_markup defines profit floor, commission pool is between min and max markup.';
COMMENT ON COLUMN pricing_formula_settings.min_markup_multiplier IS 'Minimum price = Cost × this value. This is the profit floor that is NEVER touched.';
COMMENT ON COLUMN pricing_formula_settings.max_markup_multiplier IS 'Maximum price = Cost × this value. Commission pool is capped at (max - min) × cost.';
COMMENT ON TABLE order_pricing_breakdown IS 'Tracks the exact pricing formula applied to each order for transparency and audit trail.';
