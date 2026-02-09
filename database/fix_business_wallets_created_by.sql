-- Fix business_wallets created_by foreign key constraint
-- The column should be nullable and not have a foreign key constraint

-- Drop the problematic foreign key constraint
ALTER TABLE business_wallets 
  DROP CONSTRAINT IF EXISTS business_wallets_created_by_fkey;

-- Make sure created_by is nullable (it should already be, but let's be explicit)
ALTER TABLE business_wallets 
  ALTER COLUMN created_by DROP NOT NULL;

-- Add a comment explaining what this column is for
COMMENT ON COLUMN business_wallets.created_by IS 'Auth user ID who created the wallet (for audit purposes only, no FK constraint)';
