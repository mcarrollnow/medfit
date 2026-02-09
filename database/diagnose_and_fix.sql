-- ============================================================================
-- DIAGNOSTIC AND FIX SCRIPT
-- ============================================================================
-- This script will show you what's actually wrong, then fix it
-- Run each section separately in Supabase SQL Editor to see results
-- ============================================================================


-- ============================================================================
-- SECTION 1: DIAGNOSTIC - Check what columns exist
-- ============================================================================
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('business_wallets', 'customers', 'orders', 'wallet_transactions')
ORDER BY table_name, ordinal_position;


-- ============================================================================
-- SECTION 2: DIAGNOSTIC - Check foreign key constraints
-- ============================================================================
SELECT 
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS references_table,
  ccu.column_name AS references_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON tc.constraint_name = ccu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('business_wallets', 'customers', 'orders', 'wallet_transactions')
ORDER BY tc.table_name;


-- ============================================================================
-- SECTION 3: FIX - Only run after reviewing diagnostics above
-- ============================================================================

-- Fix business_wallets.created_by (no FK needed, it's auth.users.id for audit)
ALTER TABLE business_wallets 
  DROP CONSTRAINT IF EXISTS business_wallets_created_by_fkey;

-- Fix customers.default_wallet_id (should reference business_wallets)
ALTER TABLE customers 
  DROP CONSTRAINT IF EXISTS customers_default_wallet_id_fkey;

ALTER TABLE customers
  ADD CONSTRAINT customers_default_wallet_id_fkey 
  FOREIGN KEY (default_wallet_id) 
  REFERENCES business_wallets(id) 
  ON DELETE SET NULL;

-- Fix orders.assigned_wallet_id (should reference business_wallets)  
ALTER TABLE orders 
  DROP CONSTRAINT IF EXISTS orders_assigned_wallet_id_fkey;

ALTER TABLE orders
  ADD CONSTRAINT orders_assigned_wallet_id_fkey 
  FOREIGN KEY (assigned_wallet_id) 
  REFERENCES business_wallets(id) 
  ON DELETE SET NULL;

-- Fix wallet_transactions.created_by (no FK needed, it's auth.users.id for audit)
ALTER TABLE wallet_transactions 
  DROP CONSTRAINT IF EXISTS wallet_transactions_created_by_fkey;

-- Fix wallet_transactions.order_id (no FK needed to avoid circular dependency)
ALTER TABLE wallet_transactions 
  DROP CONSTRAINT IF EXISTS wallet_transactions_order_id_fkey;


-- ============================================================================
-- SECTION 4: RELOAD POSTGREST SCHEMA CACHE (CRITICAL!)
-- ============================================================================
NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');


-- ============================================================================
-- SECTION 5: VERIFY THE FIX
-- ============================================================================
SELECT 
  'customers.default_wallet_id FK' AS check_item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_name = 'customers' 
      AND constraint_name = 'customers_default_wallet_id_fkey'
    ) THEN '✅ EXISTS' 
    ELSE '❌ MISSING' 
  END AS status
UNION ALL
SELECT 
  'business_wallets.created_by FK' AS check_item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_name = 'business_wallets' 
      AND constraint_name = 'business_wallets_created_by_fkey'
    ) THEN '❌ SHOULD NOT EXIST' 
    ELSE '✅ REMOVED' 
  END AS status;
