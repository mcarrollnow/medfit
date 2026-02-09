-- Add discount fields to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_code_id UUID REFERENCES discount_codes(id) ON DELETE SET NULL;

-- Add index for discount_code_id for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_discount_code_id ON orders(discount_code_id);

-- Add comment
COMMENT ON COLUMN orders.discount_amount IS 'The total discount amount applied to this order';
COMMENT ON COLUMN orders.discount_code_id IS 'Reference to the discount code used for this order';
