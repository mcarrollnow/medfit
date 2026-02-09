-- Optimize RLS policies by wrapping auth.uid() with SELECT
-- This prevents auth.uid() from being re-evaluated for each row
-- Performance improvement: 10-100x faster on large queries
-- Reference: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

-- ============================================================================
-- CUSTOMERS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Customers can view own record" ON customers;
CREATE POLICY "Customers can view own record"
  ON customers FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Customers can update own record" ON customers;
CREATE POLICY "Customers can update own record"
  ON customers FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Allow customer creation" ON customers;
CREATE POLICY "Allow customer creation"
  ON customers FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Reps can view assigned customers" ON customers;
CREATE POLICY "Reps can view assigned customers"
  ON customers FOR SELECT
  USING (
    rep_id IN (
      SELECT id FROM users WHERE auth_id = (select auth.uid())
    )
  );

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Customers can view own orders" ON orders;
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (
    customer_id IN (
      SELECT c.id FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE u.auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Customers can create orders" ON orders;
CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (
    customer_id IN (
      SELECT c.id FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE u.auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Customers can update own orders" ON orders;
CREATE POLICY "Customers can update own orders"
  ON orders FOR UPDATE
  USING (
    customer_id IN (
      SELECT c.id FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE u.auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Reps can view orders from assigned customers" ON orders;
CREATE POLICY "Reps can view orders from assigned customers"
  ON orders FOR SELECT
  USING (
    customer_id IN (
      SELECT c.id FROM customers c
      JOIN users u ON c.rep_id = u.id
      WHERE u.auth_id = (select auth.uid())
    )
  );

-- ============================================================================
-- ORDER_ITEMS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Customers can view own order items" ON order_items;
CREATE POLICY "Customers can view own order items"
  ON order_items FOR SELECT
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE u.auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Customers can add items to own orders" ON order_items;
CREATE POLICY "Customers can add items to own orders"
  ON order_items FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE u.auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Customers can update own order items" ON order_items;
CREATE POLICY "Customers can update own order items"
  ON order_items FOR UPDATE
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE u.auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Customers can delete own order items" ON order_items;
CREATE POLICY "Customers can delete own order items"
  ON order_items FOR DELETE
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE u.auth_id = (select auth.uid())
    )
  );

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can view products" ON products;
CREATE POLICY "Authenticated users can view products"
  ON products FOR SELECT
  USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================================================
-- DISCOUNT_USAGE TABLE
-- ============================================================================
-- Note: discount_usage table has order_id, not user_id
-- Policies need to join through orders -> customers -> users

DROP POLICY IF EXISTS "Users can view own discount usage" ON discount_usage;
CREATE POLICY "Users can view own discount usage"
  ON discount_usage FOR SELECT
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE u.auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create own discount usage" ON discount_usage;
CREATE POLICY "Users can create own discount usage"
  ON discount_usage FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE u.auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can view all discount usage" ON discount_usage;
CREATE POLICY "Admins can view all discount usage"
  ON discount_usage FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage all discount usage" ON discount_usage;
CREATE POLICY "Admins can manage all discount usage"
  ON discount_usage FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================================================
-- BUSINESS_WALLETS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Admin full access to business_wallets" ON business_wallets;
CREATE POLICY "Admin full access to business_wallets"
  ON business_wallets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================================================
-- WALLET_TRANSACTIONS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Admin full access to wallet_transactions" ON wallet_transactions;
CREATE POLICY "Admin full access to wallet_transactions"
  ON wallet_transactions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================================================
-- SHIPPING_ADDRESSES TABLE
-- ============================================================================
-- Note: shipping_addresses has customer_id, not user_id

DROP POLICY IF EXISTS "Users can view own shipping addresses" ON shipping_addresses;
CREATE POLICY "Users can view own shipping addresses"
  ON shipping_addresses FOR SELECT
  USING (
    customer_id IN (
      SELECT c.id FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE u.auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own shipping addresses" ON shipping_addresses;
CREATE POLICY "Users can insert own shipping addresses"
  ON shipping_addresses FOR INSERT
  WITH CHECK (
    customer_id IN (
      SELECT c.id FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE u.auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own shipping addresses" ON shipping_addresses;
CREATE POLICY "Users can update own shipping addresses"
  ON shipping_addresses FOR UPDATE
  USING (
    customer_id IN (
      SELECT c.id FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE u.auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete own shipping addresses" ON shipping_addresses;
CREATE POLICY "Users can delete own shipping addresses"
  ON shipping_addresses FOR DELETE
  USING (
    customer_id IN (
      SELECT c.id FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE u.auth_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can view all shipping addresses" ON shipping_addresses;
CREATE POLICY "Admins can view all shipping addresses"
  ON shipping_addresses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================================================
-- SUPPORT_TICKETS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Reps can create support tickets" ON support_tickets;
CREATE POLICY "Reps can create support tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = (select auth.uid()) AND role = 'rep'
    )
  );

DROP POLICY IF EXISTS "Reps can view their own tickets" ON support_tickets;
CREATE POLICY "Reps can view their own tickets"
  ON support_tickets FOR SELECT
  USING (
    created_by_rep = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM users WHERE auth_id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Reps can update their own tickets" ON support_tickets;
CREATE POLICY "Reps can update their own tickets"
  ON support_tickets FOR UPDATE
  USING (
    created_by_rep = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM users WHERE auth_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================================================
-- USERS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth_id = (select auth.uid()));

-- ============================================================================
-- WEBAUTHN_CREDENTIALS TABLE (Skip if table doesn't exist)
-- ============================================================================
-- Commenting out as these tables may not exist in all deployments
-- Uncomment if you have webauthn_credentials table

-- DROP POLICY IF EXISTS "Users can view own credentials" ON webauthn_credentials;
-- CREATE POLICY "Users can view own credentials"
--   ON webauthn_credentials FOR SELECT
--   USING (user_id = (select auth.uid()));

-- DROP POLICY IF EXISTS "Users can manage own credentials" ON webauthn_credentials;
-- CREATE POLICY "Users can manage own credentials"
--   ON webauthn_credentials FOR ALL
--   USING (user_id = (select auth.uid()));

-- DROP POLICY IF EXISTS "Users can add own credentials" ON webauthn_credentials;
-- CREATE POLICY "Users can add own credentials"
--   ON webauthn_credentials FOR INSERT
--   WITH CHECK (user_id = (select auth.uid()));

-- DROP POLICY IF EXISTS "Users can update own credentials" ON webauthn_credentials;
-- CREATE POLICY "Users can update own credentials"
--   ON webauthn_credentials FOR UPDATE
--   USING (user_id = (select auth.uid()));

-- DROP POLICY IF EXISTS "Users can delete own credentials" ON webauthn_credentials;
-- CREATE POLICY "Users can delete own credentials"
--   ON webauthn_credentials FOR DELETE
--   USING (user_id = (select auth.uid()));

-- DROP POLICY IF EXISTS "Service role full access credentials" ON webauthn_credentials;
-- CREATE POLICY "Service role full access credentials"
--   ON webauthn_credentials FOR ALL
--   USING ((select auth.role()) = 'service_role');

-- ============================================================================
-- WEBAUTHN_CHALLENGES TABLE (Skip if table doesn't exist)
-- ============================================================================
-- Commenting out as these tables may not exist in all deployments
-- Uncomment if you have webauthn_challenges table

-- DROP POLICY IF EXISTS "Users can view own challenges" ON webauthn_challenges;
-- CREATE POLICY "Users can view own challenges"
--   ON webauthn_challenges FOR SELECT
--   USING (user_id = (select auth.uid()));

-- DROP POLICY IF EXISTS "System can create challenges" ON webauthn_challenges;
-- CREATE POLICY "System can create challenges"
--   ON webauthn_challenges FOR INSERT
--   WITH CHECK (true);

-- DROP POLICY IF EXISTS "System can update challenges" ON webauthn_challenges;
-- CREATE POLICY "System can update challenges"
--   ON webauthn_challenges FOR UPDATE
--   USING (true);

-- DROP POLICY IF EXISTS "System can delete challenges" ON webauthn_challenges;
-- CREATE POLICY "System can delete challenges"
--   ON webauthn_challenges FOR DELETE
--   USING (true);

-- DROP POLICY IF EXISTS "Service role full access challenges" ON webauthn_challenges;
-- CREATE POLICY "Service role full access challenges"
--   ON webauthn_challenges FOR ALL
--   USING ((select auth.role()) = 'service_role');
