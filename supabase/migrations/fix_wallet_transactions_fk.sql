-- Migration: Fix wallet_transactions foreign key constraint
-- Allows orders to be deleted while preserving transaction history

-- Make order_id nullable (if not already)
ALTER TABLE wallet_transactions 
  ALTER COLUMN order_id DROP NOT NULL;

-- Drop existing foreign key constraint
ALTER TABLE wallet_transactions 
  DROP CONSTRAINT IF EXISTS wallet_transactions_order_id_fkey;

-- Recreate with SET NULL on delete
ALTER TABLE wallet_transactions
  ADD CONSTRAINT wallet_transactions_order_id_fkey
  FOREIGN KEY (order_id)
  REFERENCES orders(id)
  ON DELETE SET NULL;

-- Add comment for documentation
COMMENT ON CONSTRAINT wallet_transactions_order_id_fkey ON wallet_transactions IS 
  'Foreign key to orders table. Sets order_id to NULL when order is deleted to preserve transaction history.';
