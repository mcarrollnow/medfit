-- ============================================================================
-- TEST WALLET SYSTEM
-- ============================================================================
-- Quick tests to confirm everything is working
-- ============================================================================

-- Test 1: Show all customers and their assigned wallets
SELECT 
  c.id AS customer_id,
  u.email,
  c.customer_type,
  bw.label AS assigned_wallet,
  bw.address AS wallet_address,
  bw.is_active AS wallet_active
FROM customers c
LEFT JOIN users u ON u.id = c.user_id
LEFT JOIN business_wallets bw ON bw.id = c.default_wallet_id
ORDER BY c.created_at DESC
LIMIT 10;


-- Test 2: Show all business wallets and how many customers use them
SELECT 
  bw.label AS wallet_name,
  bw.address,
  bw.currency,
  bw.is_active,
  COUNT(c.id) AS total_customers_assigned
FROM business_wallets bw
LEFT JOIN customers c ON c.default_wallet_id = bw.id
GROUP BY bw.id, bw.label, bw.address, bw.currency, bw.is_active
ORDER BY total_customers_assigned DESC;


-- Test 3: Check if any customers still don't have a wallet (should be 0)
SELECT 
  COUNT(*) AS customers_without_wallet
FROM customers
WHERE default_wallet_id IS NULL;


-- Test 4: Test the trigger by seeing the function
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'assign_default_wallet_to_customer';
