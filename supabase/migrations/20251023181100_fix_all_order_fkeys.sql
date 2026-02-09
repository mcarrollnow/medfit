-- Fix all foreign key constraints that reference orders table
-- This ensures orders can be deleted cleanly with all related data cascading

-- Order Items: CASCADE delete (when order deleted, items should be deleted)
ALTER TABLE order_items
DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;

ALTER TABLE order_items
ADD CONSTRAINT order_items_order_id_fkey
FOREIGN KEY (order_id)
REFERENCES orders(id)
ON DELETE CASCADE;

-- Discount Usage: Already fixed in previous migration, but ensuring it's correct
ALTER TABLE discount_usage
DROP CONSTRAINT IF EXISTS discount_usage_order_id_fkey;

ALTER TABLE discount_usage
ADD CONSTRAINT discount_usage_order_id_fkey
FOREIGN KEY (order_id)
REFERENCES orders(id)
ON DELETE CASCADE;

-- Add comments
COMMENT ON CONSTRAINT order_items_order_id_fkey ON order_items IS 
'Foreign key to orders table with CASCADE delete - when an order is deleted, all order items are automatically deleted';

COMMENT ON CONSTRAINT discount_usage_order_id_fkey ON discount_usage IS 
'Foreign key to orders table with CASCADE delete - when an order is deleted, discount usage records are automatically deleted';
