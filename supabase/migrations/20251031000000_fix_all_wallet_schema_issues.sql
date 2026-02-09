-- ============================================================================
-- FIX ALL WALLET-RELATED SCHEMA ISSUES
-- ============================================================================
-- Run this migration to fix all PostgREST schema cache and FK constraint issues
-- Created: 2025-10-31

-- STEP 1: Fix business_wallets.created_by foreign key constraint
-- ============================================================================
-- Remove the problematic FK constraint that was causing wallet creation to fail
ALTER TABLE business_wallets 
  DROP CONSTRAINT IF EXISTS business_wallets_created_by_fkey;

-- Make sure created_by is nullable
ALTER TABLE business_wallets 
  ALTER COLUMN created_by DROP NOT NULL;

COMMENT ON COLUMN business_wallets.created_by IS 'Auth user ID who created the wallet (for audit purposes only, no FK constraint)';


-- STEP 2: Fix wallet_transactions.created_by foreign key constraint
-- ============================================================================
ALTER TABLE wallet_transactions 
  DROP CONSTRAINT IF EXISTS wallet_transactions_created_by_fkey;

ALTER TABLE wallet_transactions 
  ALTER COLUMN created_by DROP NOT NULL;

COMMENT ON COLUMN wallet_transactions.created_by IS 'Auth user ID who initiated the transaction (for audit purposes only, no FK constraint)';


-- STEP 3: Ensure customers.default_wallet_id foreign key exists and is correct
-- ============================================================================
-- Drop and recreate to ensure it's properly configured
ALTER TABLE customers 
  DROP CONSTRAINT IF EXISTS customers_default_wallet_id_fkey;

-- Add the column if it doesn't exist
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS default_wallet_id UUID;

-- Add the foreign key constraint
ALTER TABLE customers
  ADD CONSTRAINT customers_default_wallet_id_fkey 
  FOREIGN KEY (default_wallet_id) 
  REFERENCES business_wallets(id) 
  ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_customers_default_wallet ON customers(default_wallet_id);

COMMENT ON COLUMN customers.default_wallet_id IS 'Default business wallet assigned to this customer for receiving payments';


-- STEP 4: Ensure orders.assigned_wallet_id foreign key exists and is correct
-- ============================================================================
ALTER TABLE orders 
  DROP CONSTRAINT IF EXISTS orders_assigned_wallet_id_fkey;

-- Add the column if it doesn't exist
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS assigned_wallet_id UUID;

-- Add the foreign key constraint
ALTER TABLE orders
  ADD CONSTRAINT orders_assigned_wallet_id_fkey 
  FOREIGN KEY (assigned_wallet_id) 
  REFERENCES business_wallets(id) 
  ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_orders_assigned_wallet ON orders(assigned_wallet_id);

COMMENT ON COLUMN orders.assigned_wallet_id IS 'Business wallet assigned to receive payment for this order';


-- STEP 5: Ensure all wallet encryption fields exist
-- ============================================================================
ALTER TABLE business_wallets
  ADD COLUMN IF NOT EXISTS encrypted_private_key TEXT,
  ADD COLUMN IF NOT EXISTS private_key_iv TEXT,
  ADD COLUMN IF NOT EXISTS private_key_auth_tag TEXT,
  ADD COLUMN IF NOT EXISTS encrypted_mnemonic TEXT,
  ADD COLUMN IF NOT EXISTS mnemonic_iv TEXT,
  ADD COLUMN IF NOT EXISTS mnemonic_auth_tag TEXT,
  ADD COLUMN IF NOT EXISTS pin_hash TEXT,
  ADD COLUMN IF NOT EXISTS webauthn_credential_id UUID;

-- Add indexes for security fields
CREATE INDEX IF NOT EXISTS idx_business_wallets_pin_hash 
  ON business_wallets(pin_hash) 
  WHERE pin_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_business_wallets_webauthn 
  ON business_wallets(webauthn_credential_id) 
  WHERE webauthn_credential_id IS NOT NULL;

-- Add comments
COMMENT ON COLUMN business_wallets.encrypted_private_key IS 'AES-256-GCM encrypted private key';
COMMENT ON COLUMN business_wallets.private_key_iv IS 'Initialization vector for private key encryption';
COMMENT ON COLUMN business_wallets.private_key_auth_tag IS 'Authentication tag for private key encryption';
COMMENT ON COLUMN business_wallets.encrypted_mnemonic IS 'AES-256-GCM encrypted mnemonic phrase (optional)';
COMMENT ON COLUMN business_wallets.mnemonic_iv IS 'Initialization vector for mnemonic encryption';
COMMENT ON COLUMN business_wallets.mnemonic_auth_tag IS 'Authentication tag for mnemonic encryption';
COMMENT ON COLUMN business_wallets.pin_hash IS 'Hashed PIN for wallet protection (optional)';
COMMENT ON COLUMN business_wallets.webauthn_credential_id IS 'WebAuthn credential ID for hardware key protection (optional)';


-- STEP 6: Ensure wallet_transactions has all necessary columns
-- ============================================================================
ALTER TABLE wallet_transactions
  ADD COLUMN IF NOT EXISTS order_id UUID;

-- Add index for order lookups
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_order_id 
  ON wallet_transactions(order_id);


-- STEP 7: Verify all business_wallets columns exist
-- ============================================================================
-- Ensure balance columns exist with proper types
ALTER TABLE business_wallets
  ADD COLUMN IF NOT EXISTS balance_eth TEXT DEFAULT '0',
  ADD COLUMN IF NOT EXISTS balance_usdc TEXT DEFAULT '0';

-- Ensure metadata columns exist
ALTER TABLE business_wallets
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();


-- STEP 8: Reload PostgREST schema cache
-- ============================================================================
-- This is CRITICAL - tells PostgREST to refresh its understanding of the schema
NOTIFY pgrst, 'reload schema';


-- STEP 9: Verify the fix by checking for common issues
-- ============================================================================
-- This query will help debug if issues persist
-- (Comment it out after running once)
/*
SELECT 
  'business_wallets created_by FK' AS check_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'business_wallets' 
    AND constraint_name = 'business_wallets_created_by_fkey'
  ) THEN '❌ FK exists (should be removed)' 
  ELSE '✅ FK removed' END AS status
UNION ALL
SELECT 
  'customers default_wallet_id FK' AS check_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'customers' 
    AND constraint_name = 'customers_default_wallet_id_fkey'
  ) THEN '✅ FK exists' 
  ELSE '❌ FK missing' END AS status;
*/
