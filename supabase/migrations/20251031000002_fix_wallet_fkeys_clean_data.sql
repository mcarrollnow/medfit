-- ============================================================================
-- FIX WALLET FOREIGN KEYS - WITH DATA CLEANUP
-- ============================================================================
-- Step 1: Clean up orphaned references
-- Step 2: Add foreign key constraints
-- Step 3: Reload PostgREST cache
-- ============================================================================


-- STEP 1: Clean up orphaned data in customers.default_wallet_id
-- Set to NULL if the wallet doesn't exist
UPDATE customers
SET default_wallet_id = NULL
WHERE default_wallet_id IS NOT NULL
  AND default_wallet_id NOT IN (SELECT id FROM business_wallets);


-- STEP 2: Clean up orphaned data in orders.assigned_wallet_id
-- Set to NULL if the wallet doesn't exist
UPDATE orders
SET assigned_wallet_id = NULL
WHERE assigned_wallet_id IS NOT NULL
  AND assigned_wallet_id NOT IN (SELECT id FROM business_wallets);


-- STEP 3: Drop existing constraints if they exist
ALTER TABLE customers
  DROP CONSTRAINT IF EXISTS customers_default_wallet_id_fkey;

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_assigned_wallet_id_fkey;


-- STEP 4: Ensure columns exist
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS default_wallet_id UUID;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS assigned_wallet_id UUID;


-- STEP 5: Add foreign key constraints (now that data is clean)
ALTER TABLE customers
  ADD CONSTRAINT customers_default_wallet_id_fkey 
  FOREIGN KEY (default_wallet_id) 
  REFERENCES business_wallets(id) 
  ON DELETE SET NULL;

ALTER TABLE orders
  ADD CONSTRAINT orders_assigned_wallet_id_fkey 
  FOREIGN KEY (assigned_wallet_id) 
  REFERENCES business_wallets(id) 
  ON DELETE SET NULL;


-- STEP 6: Create indexes
CREATE INDEX IF NOT EXISTS idx_customers_default_wallet 
  ON customers(default_wallet_id);

CREATE INDEX IF NOT EXISTS idx_orders_assigned_wallet 
  ON orders(assigned_wallet_id);


-- STEP 7: Add comments
COMMENT ON COLUMN customers.default_wallet_id IS 
  'Default business wallet assigned to this customer for receiving payments';

COMMENT ON COLUMN orders.assigned_wallet_id IS 
  'Business wallet assigned to receive payment for this order';


-- STEP 8: Reload PostgREST schema cache (CRITICAL!)
NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');


-- Done! Foreign keys added with clean data.
