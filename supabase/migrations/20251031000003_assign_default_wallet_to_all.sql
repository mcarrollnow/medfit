-- ============================================================================
-- ASSIGN DEFAULT WALLET TO ALL CUSTOMERS
-- ============================================================================
-- Everyone needs a wallet for payments to go somewhere!
-- This assigns the first active wallet as default for all customers
-- ============================================================================


-- STEP 1: Ensure columns exist
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS default_wallet_id UUID;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS assigned_wallet_id UUID;


-- STEP 2: Drop existing constraints if they exist
ALTER TABLE customers
  DROP CONSTRAINT IF EXISTS customers_default_wallet_id_fkey;

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_assigned_wallet_id_fkey;


-- STEP 3: Assign first active wallet to ALL customers who don't have one
UPDATE customers
SET default_wallet_id = (
  SELECT id FROM business_wallets 
  WHERE is_active = true 
  ORDER BY created_at ASC
  LIMIT 1
)
WHERE default_wallet_id IS NULL;


-- STEP 4: Assign wallet to orders that don't have one
UPDATE orders
SET assigned_wallet_id = (
  SELECT id FROM business_wallets 
  WHERE is_active = true 
  ORDER BY created_at ASC
  LIMIT 1
)
WHERE assigned_wallet_id IS NULL
  AND payment_status = 'pending'; -- Only pending orders


-- STEP 5: Clean up any remaining orphaned references (just in case)
UPDATE customers
SET default_wallet_id = NULL
WHERE default_wallet_id IS NOT NULL
  AND default_wallet_id NOT IN (SELECT id FROM business_wallets);

UPDATE orders
SET assigned_wallet_id = NULL
WHERE assigned_wallet_id IS NOT NULL
  AND assigned_wallet_id NOT IN (SELECT id FROM business_wallets);


-- STEP 6: Add foreign key constraints
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


-- STEP 7: Create indexes
CREATE INDEX IF NOT EXISTS idx_customers_default_wallet 
  ON customers(default_wallet_id);

CREATE INDEX IF NOT EXISTS idx_orders_assigned_wallet 
  ON orders(assigned_wallet_id);


-- STEP 8: Add comments
COMMENT ON COLUMN customers.default_wallet_id IS 
  'Default business wallet assigned to this customer for receiving payments';

COMMENT ON COLUMN orders.assigned_wallet_id IS 
  'Business wallet assigned to receive payment for this order';


-- STEP 9: Create trigger to auto-assign wallet to new customers
CREATE OR REPLACE FUNCTION assign_default_wallet_to_customer()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-assign the first active wallet to new customers
  IF NEW.default_wallet_id IS NULL THEN
    NEW.default_wallet_id := (
      SELECT id FROM business_wallets 
      WHERE is_active = true 
      ORDER BY created_at ASC
      LIMIT 1
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_assign_wallet_to_customer ON customers;
CREATE TRIGGER auto_assign_wallet_to_customer
  BEFORE INSERT ON customers
  FOR EACH ROW
  EXECUTE FUNCTION assign_default_wallet_to_customer();


-- STEP 10: Reload PostgREST schema cache (CRITICAL!)
NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');


-- Done! All customers now have a default wallet.
-- New customers will automatically get the first active wallet assigned.
