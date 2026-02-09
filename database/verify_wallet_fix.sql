-- ============================================================================
-- VERIFY WALLET FIX
-- ============================================================================
-- Run these queries to confirm everything is working
-- ============================================================================


-- Check 1: Verify foreign keys exist
SELECT 
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS references_table
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON tc.constraint_name = ccu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND (
    tc.constraint_name = 'customers_default_wallet_id_fkey'
    OR tc.constraint_name = 'orders_assigned_wallet_id_fkey'
  );


-- Check 2: Count customers with and without wallets
SELECT 
  'Total customers' AS metric,
  COUNT(*) AS count
FROM customers
UNION ALL
SELECT 
  'Customers WITH wallet' AS metric,
  COUNT(*) AS count
FROM customers
WHERE default_wallet_id IS NOT NULL
UNION ALL
SELECT 
  'Customers WITHOUT wallet' AS metric,
  COUNT(*) AS count
FROM customers
WHERE default_wallet_id IS NULL;


-- Check 3: Show which wallet is assigned to customers
SELECT 
  bw.label AS wallet_name,
  bw.address AS wallet_address,
  COUNT(c.id) AS customers_assigned
FROM business_wallets bw
LEFT JOIN customers c ON c.default_wallet_id = bw.id
WHERE bw.is_active = true
GROUP BY bw.id, bw.label, bw.address
ORDER BY customers_assigned DESC;


-- Check 4: Verify trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'auto_assign_wallet_to_customer';
