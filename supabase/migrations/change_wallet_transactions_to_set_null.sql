-- Migration: Change wallet_transactions FK from CASCADE to SET NULL
-- This preserves transaction history when orders are deleted

-- Step 1: Make order_id nullable (if not already)
ALTER TABLE wallet_transactions 
  ALTER COLUMN order_id DROP NOT NULL;

-- Step 2: Drop the CASCADE constraint
ALTER TABLE wallet_transactions 
  DROP CONSTRAINT wallet_transactions_order_id_fkey;

-- Step 3: Recreate with SET NULL behavior
ALTER TABLE wallet_transactions
  ADD CONSTRAINT wallet_transactions_order_id_fkey
  FOREIGN KEY (order_id)
  REFERENCES orders(id)
  ON DELETE SET NULL;

-- Add documentation comment
COMMENT ON CONSTRAINT wallet_transactions_order_id_fkey ON wallet_transactions IS 
  'Foreign key to orders. Sets order_id to NULL when order is deleted, preserving transaction history for auditing.';
