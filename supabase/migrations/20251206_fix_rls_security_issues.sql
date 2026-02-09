-- Fix RLS Security Issues
-- This migration enables RLS and adds appropriate policies for tables flagged by Supabase linter

-- =====================================================
-- 1. FIX: referral_stats view with SECURITY DEFINER
-- =====================================================
-- Drop the view since it has SECURITY DEFINER and the underlying tables may not exist
-- You can recreate it later if needed with proper security settings
DROP VIEW IF EXISTS public.referral_stats;

-- =====================================================
-- 2. FIX: ai_ticket_activity - Enable RLS
-- =====================================================
ALTER TABLE public.ai_ticket_activity ENABLE ROW LEVEL SECURITY;

-- Allow admins full access
DROP POLICY IF EXISTS "Admins can manage ai_ticket_activity" ON public.ai_ticket_activity;
CREATE POLICY "Admins can manage ai_ticket_activity" ON public.ai_ticket_activity
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Allow service role full access
DROP POLICY IF EXISTS "Service role ai_ticket_activity" ON public.ai_ticket_activity;
CREATE POLICY "Service role ai_ticket_activity" ON public.ai_ticket_activity
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 3. FIX: customer_assigned_discounts - Enable RLS
-- =====================================================
ALTER TABLE public.customer_assigned_discounts ENABLE ROW LEVEL SECURITY;

-- Customers can view their own discounts
DROP POLICY IF EXISTS "Customers can view own discounts" ON public.customer_assigned_discounts;
CREATE POLICY "Customers can view own discounts" ON public.customer_assigned_discounts
  FOR SELECT TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id IN (
        SELECT id FROM users WHERE auth_id = auth.uid()
      )
    )
  );

-- Admins can manage all discounts
DROP POLICY IF EXISTS "Admins can manage customer_assigned_discounts" ON public.customer_assigned_discounts;
CREATE POLICY "Admins can manage customer_assigned_discounts" ON public.customer_assigned_discounts
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Service role full access
DROP POLICY IF EXISTS "Service role customer_assigned_discounts" ON public.customer_assigned_discounts;
CREATE POLICY "Service role customer_assigned_discounts" ON public.customer_assigned_discounts
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 4. FIX: business_wallets - Enable RLS
-- =====================================================
ALTER TABLE public.business_wallets ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view active wallets (for payment purposes)
DROP POLICY IF EXISTS "Authenticated users can view active wallets" ON public.business_wallets;
CREATE POLICY "Authenticated users can view active wallets" ON public.business_wallets
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Admins can manage all wallets
DROP POLICY IF EXISTS "Admins can manage business_wallets" ON public.business_wallets;
CREATE POLICY "Admins can manage business_wallets" ON public.business_wallets
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Service role full access
DROP POLICY IF EXISTS "Service role business_wallets" ON public.business_wallets;
CREATE POLICY "Service role business_wallets" ON public.business_wallets
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 5. FIX: ai_proposed_actions - Enable RLS
-- =====================================================
ALTER TABLE public.ai_proposed_actions ENABLE ROW LEVEL SECURITY;

-- Admins can manage AI proposed actions
DROP POLICY IF EXISTS "Admins can manage ai_proposed_actions" ON public.ai_proposed_actions;
CREATE POLICY "Admins can manage ai_proposed_actions" ON public.ai_proposed_actions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Service role full access
DROP POLICY IF EXISTS "Service role ai_proposed_actions" ON public.ai_proposed_actions;
CREATE POLICY "Service role ai_proposed_actions" ON public.ai_proposed_actions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 6. FIX: wallet_transactions - Enable RLS
-- =====================================================
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Admins can view all wallet transactions
DROP POLICY IF EXISTS "Admins can manage wallet_transactions" ON public.wallet_transactions;
CREATE POLICY "Admins can manage wallet_transactions" ON public.wallet_transactions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Service role full access
DROP POLICY IF EXISTS "Service role wallet_transactions" ON public.wallet_transactions;
CREATE POLICY "Service role wallet_transactions" ON public.wallet_transactions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 7. FIX: payout_commissions - Enable RLS
-- =====================================================
ALTER TABLE public.payout_commissions ENABLE ROW LEVEL SECURITY;

-- Reps can view their own payout commissions
DROP POLICY IF EXISTS "Reps can view own payout_commissions" ON public.payout_commissions;
CREATE POLICY "Reps can view own payout_commissions" ON public.payout_commissions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rep_payouts rp
      JOIN users u ON u.id = rp.rep_id
      WHERE rp.id = payout_commissions.payout_id
      AND u.auth_id = auth.uid()
    )
  );

-- Admins can manage all payout commissions
DROP POLICY IF EXISTS "Admins can manage payout_commissions" ON public.payout_commissions;
CREATE POLICY "Admins can manage payout_commissions" ON public.payout_commissions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Service role full access
DROP POLICY IF EXISTS "Service role payout_commissions" ON public.payout_commissions;
CREATE POLICY "Service role payout_commissions" ON public.payout_commissions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 8. FIX: rep_commissions - Enable RLS
-- =====================================================
ALTER TABLE public.rep_commissions ENABLE ROW LEVEL SECURITY;

-- Reps can view their own commissions
DROP POLICY IF EXISTS "Reps can view own rep_commissions" ON public.rep_commissions;
CREATE POLICY "Reps can view own rep_commissions" ON public.rep_commissions
  FOR SELECT TO authenticated
  USING (
    rep_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

-- Admins can manage all rep commissions
DROP POLICY IF EXISTS "Admins can manage rep_commissions" ON public.rep_commissions;
CREATE POLICY "Admins can manage rep_commissions" ON public.rep_commissions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Service role full access
DROP POLICY IF EXISTS "Service role rep_commissions" ON public.rep_commissions;
CREATE POLICY "Service role rep_commissions" ON public.rep_commissions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 9. FIX: rep_payouts - Enable RLS
-- =====================================================
ALTER TABLE public.rep_payouts ENABLE ROW LEVEL SECURITY;

-- Reps can view their own payouts
DROP POLICY IF EXISTS "Reps can view own rep_payouts" ON public.rep_payouts;
CREATE POLICY "Reps can view own rep_payouts" ON public.rep_payouts
  FOR SELECT TO authenticated
  USING (
    rep_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

-- Admins can manage all rep payouts
DROP POLICY IF EXISTS "Admins can manage rep_payouts" ON public.rep_payouts;
CREATE POLICY "Admins can manage rep_payouts" ON public.rep_payouts
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Service role full access
DROP POLICY IF EXISTS "Service role rep_payouts" ON public.rep_payouts;
CREATE POLICY "Service role rep_payouts" ON public.rep_payouts
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 10. FIX: rep_store_purchases - Enable RLS
-- =====================================================
ALTER TABLE public.rep_store_purchases ENABLE ROW LEVEL SECURITY;

-- Reps can view their own store purchases
DROP POLICY IF EXISTS "Reps can view own rep_store_purchases" ON public.rep_store_purchases;
CREATE POLICY "Reps can view own rep_store_purchases" ON public.rep_store_purchases
  FOR SELECT TO authenticated
  USING (
    rep_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

-- Reps can create their own store purchases
DROP POLICY IF EXISTS "Reps can create rep_store_purchases" ON public.rep_store_purchases;
CREATE POLICY "Reps can create rep_store_purchases" ON public.rep_store_purchases
  FOR INSERT TO authenticated
  WITH CHECK (
    rep_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

-- Admins can manage all rep store purchases
DROP POLICY IF EXISTS "Admins can manage rep_store_purchases" ON public.rep_store_purchases;
CREATE POLICY "Admins can manage rep_store_purchases" ON public.rep_store_purchases
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Service role full access
DROP POLICY IF EXISTS "Service role rep_store_purchases" ON public.rep_store_purchases;
CREATE POLICY "Service role rep_store_purchases" ON public.rep_store_purchases
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- DONE: All RLS issues fixed
-- =====================================================

