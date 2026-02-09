-- ============================================================================
-- ADD GUEST ORDER FIELDS
-- Allows orders to be created without a customer record for guest checkout
-- ============================================================================

-- Make customer_id nullable for guest orders
ALTER TABLE orders 
  ALTER COLUMN customer_id DROP NOT NULL;

-- Add guest info fields
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS is_guest_order BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS guest_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS guest_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS guest_phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS shipping_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS shipping_address_line1 VARCHAR(255),
  ADD COLUMN IF NOT EXISTS shipping_address_line2 VARCHAR(255),
  ADD COLUMN IF NOT EXISTS shipping_city VARCHAR(100),
  ADD COLUMN IF NOT EXISTS shipping_state VARCHAR(100),
  ADD COLUMN IF NOT EXISTS shipping_zip VARCHAR(20),
  ADD COLUMN IF NOT EXISTS shipping_country VARCHAR(100) DEFAULT 'USA';

-- Index for guest orders
CREATE INDEX IF NOT EXISTS idx_orders_is_guest ON orders(is_guest_order) WHERE is_guest_order = TRUE;
CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON orders(guest_email) WHERE guest_email IS NOT NULL;

COMMENT ON COLUMN orders.is_guest_order IS 'True if this order was placed without creating a customer record';
COMMENT ON COLUMN orders.guest_name IS 'Customer name for guest orders (no customer record)';
COMMENT ON COLUMN orders.guest_email IS 'Customer email for guest orders';
COMMENT ON COLUMN orders.guest_phone IS 'Customer phone for guest orders';

