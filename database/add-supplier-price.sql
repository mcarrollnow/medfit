-- Add supplier_price column to products table
-- This price is only visible to admin users

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS supplier_price TEXT DEFAULT '';

-- Add comment to describe the column
COMMENT ON COLUMN products.supplier_price IS 'Supplier price - admin only, not visible to customers or reps';
