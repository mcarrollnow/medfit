-- Fix foreign key constraint on discount_usage table to cascade on delete
-- This allows orders to be deleted without foreign key constraint errors

-- Drop the existing foreign key constraint
ALTER TABLE discount_usage
DROP CONSTRAINT IF EXISTS discount_usage_order_id_fkey;

-- Recreate the constraint with CASCADE on delete
ALTER TABLE discount_usage
ADD CONSTRAINT discount_usage_order_id_fkey
FOREIGN KEY (order_id)
REFERENCES orders(id)
ON DELETE CASCADE;

-- Add comment explaining the behavior
COMMENT ON CONSTRAINT discount_usage_order_id_fkey ON discount_usage IS 
'Foreign key to orders table with CASCADE delete - when an order is deleted, associated discount usage records are automatically deleted';
