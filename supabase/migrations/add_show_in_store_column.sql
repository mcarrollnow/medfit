-- Add show_in_store column to products table
-- Products with show_in_store = false will only appear in admin and supplier views

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_in_store BOOLEAN DEFAULT true;

-- Set recently added products (those with 0 stock and created in last 24 hours) to not show in store by default
-- This catches products just imported from supplier list
UPDATE products 
SET show_in_store = false 
WHERE current_stock = 0 
  AND created_at > NOW() - INTERVAL '24 hours'
  AND show_in_store IS NULL;

-- Ensure existing products with stock remain visible
UPDATE products 
SET show_in_store = true 
WHERE show_in_store IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN products.show_in_store IS 'Controls visibility in customer-facing store. Admin and supplier always see all products.';
