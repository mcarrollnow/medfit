-- ============================================================================
-- FIX MISSING WALLET FOREIGN KEYS
-- ============================================================================
-- Based on diagnostic results - only fixing what's actually missing
-- This will resolve PGRST200 errors for wallet relationships
-- ============================================================================


-- Add customers.default_wallet_id column and FK (if not exists)
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS default_wallet_id UUID;

ALTER TABLE customers
  ADD CONSTRAINT customers_default_wallet_id_fkey 
  FOREIGN KEY (default_wallet_id) 
  REFERENCES business_wallets(id) 
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_customers_default_wallet 
  ON customers(default_wallet_id);

COMMENT ON COLUMN customers.default_wallet_id IS 
  'Default business wallet assigned to this customer for receiving payments';


-- Add orders.assigned_wallet_id column and FK (if not exists)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS assigned_wallet_id UUID;

ALTER TABLE orders
  ADD CONSTRAINT orders_assigned_wallet_id_fkey 
  FOREIGN KEY (assigned_wallet_id) 
  REFERENCES business_wallets(id) 
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_assigned_wallet 
  ON orders(assigned_wallet_id);

COMMENT ON COLUMN orders.assigned_wallet_id IS 
  'Business wallet assigned to receive payment for this order';


-- CRITICAL: Reload PostgREST schema cache
-- Without this, PostgREST won't know about the new foreign keys
NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');


-- Done! The PGRST200 errors should now be resolved.
