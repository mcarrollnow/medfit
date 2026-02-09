-- Create product_stacks table for stack discount codes
CREATE TABLE IF NOT EXISTS product_stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stack_name TEXT NOT NULL,
  discount_code TEXT UNIQUE NOT NULL,
  discount_percent NUMERIC NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  product_ids UUID[] NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for product_stacks
CREATE INDEX IF NOT EXISTS idx_product_stacks_code ON product_stacks(discount_code);
CREATE INDEX IF NOT EXISTS idx_product_stacks_active ON product_stacks(is_active);
CREATE INDEX IF NOT EXISTS idx_product_stacks_created_by ON product_stacks(created_by);

-- Add comments
COMMENT ON TABLE product_stacks IS 'Stack discount codes that trigger when specific product combinations are ordered together';
COMMENT ON COLUMN product_stacks.discount_code IS 'Auto-generated unique discount code';
COMMENT ON COLUMN product_stacks.discount_percent IS 'Percentage discount (1-100) when all products in stack are purchased';
COMMENT ON COLUMN product_stacks.product_ids IS 'Array of product IDs that must be in cart for discount to apply';

-- Create stack_pricing table for bundle pricing
CREATE TABLE IF NOT EXISTS stack_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stack_name TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  stack_price NUMERIC NOT NULL CHECK (stack_price >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(stack_name, product_id)
);

-- Create indexes for stack_pricing
CREATE INDEX IF NOT EXISTS idx_stack_pricing_name ON stack_pricing(stack_name);
CREATE INDEX IF NOT EXISTS idx_stack_pricing_product ON stack_pricing(product_id);
CREATE INDEX IF NOT EXISTS idx_stack_pricing_active ON stack_pricing(is_active);

-- Add comments
COMMENT ON TABLE stack_pricing IS 'Special pricing for products when purchased together as a stack/bundle';
COMMENT ON COLUMN stack_pricing.stack_name IS 'Name of the product stack/bundle';
COMMENT ON COLUMN stack_pricing.stack_price IS 'Special price for this product when bought as part of the stack';

-- RLS Policies for product_stacks
ALTER TABLE product_stacks ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage product stacks" ON product_stacks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Customers can view active stacks
CREATE POLICY "Customers can view active product stacks" ON product_stacks
  FOR SELECT
  USING (is_active = true);

-- RLS Policies for stack_pricing
ALTER TABLE stack_pricing ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage stack pricing" ON stack_pricing
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Customers can view active stack pricing
CREATE POLICY "Customers can view active stack pricing" ON stack_pricing
  FOR SELECT
  USING (is_active = true);
