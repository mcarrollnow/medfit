-- =====================================================
-- FIX RLS PERFORMANCE: Wrap auth.uid() calls with SELECT
-- =====================================================
-- Generated from actual database schema dump
-- This fixes the auth_rls_initplan performance warning
-- Reference: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
--
-- Total policies fixed: 166
-- =====================================================

-- Fix: Admin full access to alchemy_webhook_events
DROP POLICY IF EXISTS "Admin full access to alchemy_webhook_events" ON "public"."alchemy_webhook_events";
CREATE POLICY "Admin full access to alchemy_webhook_events" ON "public"."alchemy_webhook_events" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."raw_user_meta_data" ->> 'role'::"text") = 'admin'::"text")))));

-- Fix: Admins can create admin notes
DROP POLICY IF EXISTS "Admins can create admin notes" ON "public"."admin_notes";
CREATE POLICY "Admins can create admin notes" ON "public"."admin_notes" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can create support chat messages
DROP POLICY IF EXISTS "Admins can create support chat messages" ON "public"."support_chat_messages";
CREATE POLICY "Admins can create support chat messages" ON "public"."support_chat_messages" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can create support chat sessions
DROP POLICY IF EXISTS "Admins can create support chat sessions" ON "public"."support_chat_sessions";
CREATE POLICY "Admins can create support chat sessions" ON "public"."support_chat_sessions" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can delete admin notes
DROP POLICY IF EXISTS "Admins can delete admin notes" ON "public"."admin_notes";
CREATE POLICY "Admins can delete admin notes" ON "public"."admin_notes" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can delete all support chat messages
DROP POLICY IF EXISTS "Admins can delete all support chat messages" ON "public"."support_chat_messages";
CREATE POLICY "Admins can delete all support chat messages" ON "public"."support_chat_messages" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can delete all support chat sessions
DROP POLICY IF EXISTS "Admins can delete all support chat sessions" ON "public"."support_chat_sessions";
CREATE POLICY "Admins can delete all support chat sessions" ON "public"."support_chat_sessions" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can delete themes
DROP POLICY IF EXISTS "Admins can delete themes" ON "public"."themes";
CREATE POLICY "Admins can delete themes" ON "public"."themes" FOR DELETE TO "authenticated" USING (((NOT "is_system") AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))));

-- Fix: Admins can insert themes
DROP POLICY IF EXISTS "Admins can insert themes" ON "public"."themes";
CREATE POLICY "Admins can insert themes" ON "public"."themes" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage Q&A pairs
DROP POLICY IF EXISTS "Admins can manage Q&A pairs" ON "public"."ai_qa_pairs";
CREATE POLICY "Admins can manage Q&A pairs" ON "public"."ai_qa_pairs" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage SMS devices
DROP POLICY IF EXISTS "Admins can manage SMS devices" ON "public"."sms_devices";
CREATE POLICY "Admins can manage SMS devices" ON "public"."sms_devices" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage ai_proposed_actions
DROP POLICY IF EXISTS "Admins can manage ai_proposed_actions" ON "public"."ai_proposed_actions";
CREATE POLICY "Admins can manage ai_proposed_actions" ON "public"."ai_proposed_actions" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage ai_ticket_activity
DROP POLICY IF EXISTS "Admins can manage ai_ticket_activity" ON "public"."ai_ticket_activity";
CREATE POLICY "Admins can manage ai_ticket_activity" ON "public"."ai_ticket_activity" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage all articles
DROP POLICY IF EXISTS "Admins can manage all articles" ON "public"."kb_articles";
CREATE POLICY "Admins can manage all articles" ON "public"."kb_articles" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage all customer wallets
DROP POLICY IF EXISTS "Admins can manage all customer wallets" ON "public"."customer_wallets";
CREATE POLICY "Admins can manage all customer wallets" ON "public"."customer_wallets" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage all message threads
DROP POLICY IF EXISTS "Admins can manage all message threads" ON "public"."message_threads";
CREATE POLICY "Admins can manage all message threads" ON "public"."message_threads" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage all messages
DROP POLICY IF EXISTS "Admins can manage all messages" ON "public"."messages";
CREATE POLICY "Admins can manage all messages" ON "public"."messages" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage all notifications
DROP POLICY IF EXISTS "Admins can manage all notifications" ON "public"."product_notifications";
CREATE POLICY "Admins can manage all notifications" ON "public"."product_notifications" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage all rep pricing
DROP POLICY IF EXISTS "Admins can manage all rep pricing" ON "public"."rep_product_pricing";
CREATE POLICY "Admins can manage all rep pricing" ON "public"."rep_product_pricing" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage all ticket messages
DROP POLICY IF EXISTS "Admins can manage all ticket messages" ON "public"."ticket_messages";
CREATE POLICY "Admins can manage all ticket messages" ON "public"."ticket_messages" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage all tickets
DROP POLICY IF EXISTS "Admins can manage all tickets" ON "public"."support_tickets";
CREATE POLICY "Admins can manage all tickets" ON "public"."support_tickets" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage all wallet transactions
DROP POLICY IF EXISTS "Admins can manage all wallet transactions" ON "public"."customer_wallet_transactions";
CREATE POLICY "Admins can manage all wallet transactions" ON "public"."customer_wallet_transactions" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage assignments
DROP POLICY IF EXISTS "Admins can manage assignments" ON "public"."customer_rep_assignments";
CREATE POLICY "Admins can manage assignments" ON "public"."customer_rep_assignments" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage business_wallets
DROP POLICY IF EXISTS "Admins can manage business_wallets" ON "public"."business_wallets";
CREATE POLICY "Admins can manage business_wallets" ON "public"."business_wallets" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage categories
DROP POLICY IF EXISTS "Admins can manage categories" ON "public"."categories";
CREATE POLICY "Admins can manage categories" ON "public"."categories" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage categories
DROP POLICY IF EXISTS "Admins can manage categories" ON "public"."kb_categories";
CREATE POLICY "Admins can manage categories" ON "public"."kb_categories" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage commission payments
DROP POLICY IF EXISTS "Admins can manage commission payments" ON "public"."rep_commission_payments";
CREATE POLICY "Admins can manage commission payments" ON "public"."rep_commission_payments" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage customer_assigned_discounts
DROP POLICY IF EXISTS "Admins can manage customer_assigned_discounts" ON "public"."customer_assigned_discounts";
CREATE POLICY "Admins can manage customer_assigned_discounts" ON "public"."customer_assigned_discounts" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage discount codes
DROP POLICY IF EXISTS "Admins can manage discount codes" ON "public"."discount_codes";
CREATE POLICY "Admins can manage discount codes" ON "public"."discount_codes" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage discount usage
DROP POLICY IF EXISTS "Admins can manage discount usage" ON "public"."discount_usage";
CREATE POLICY "Admins can manage discount usage" ON "public"."discount_usage" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage invoices
DROP POLICY IF EXISTS "Admins can manage invoices" ON "public"."invoices";
CREATE POLICY "Admins can manage invoices" ON "public"."invoices" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage order tracking
DROP POLICY IF EXISTS "Admins can manage order tracking" ON "public"."order_tracking";
CREATE POLICY "Admins can manage order tracking" ON "public"."order_tracking" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage payment transactions
DROP POLICY IF EXISTS "Admins can manage payment transactions" ON "public"."payment_transactions";
CREATE POLICY "Admins can manage payment transactions" ON "public"."payment_transactions" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage payout_commissions
DROP POLICY IF EXISTS "Admins can manage payout_commissions" ON "public"."payout_commissions";
CREATE POLICY "Admins can manage payout_commissions" ON "public"."payout_commissions" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage price history
DROP POLICY IF EXISTS "Admins can manage price history" ON "public"."price_history";
CREATE POLICY "Admins can manage price history" ON "public"."price_history" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage process docs
DROP POLICY IF EXISTS "Admins can manage process docs" ON "public"."process_docs";
CREATE POLICY "Admins can manage process docs" ON "public"."process_docs" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage product stacks
DROP POLICY IF EXISTS "Admins can manage product stacks" ON "public"."product_stacks";
CREATE POLICY "Admins can manage product stacks" ON "public"."product_stacks" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage rep wallets
DROP POLICY IF EXISTS "Admins can manage rep wallets" ON "public"."rep_wallets";
CREATE POLICY "Admins can manage rep wallets" ON "public"."rep_wallets" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage rep_commissions
DROP POLICY IF EXISTS "Admins can manage rep_commissions" ON "public"."rep_commissions";
CREATE POLICY "Admins can manage rep_commissions" ON "public"."rep_commissions" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage rep_payouts
DROP POLICY IF EXISTS "Admins can manage rep_payouts" ON "public"."rep_payouts";
CREATE POLICY "Admins can manage rep_payouts" ON "public"."rep_payouts" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage rep_store_purchases
DROP POLICY IF EXISTS "Admins can manage rep_store_purchases" ON "public"."rep_store_purchases";
CREATE POLICY "Admins can manage rep_store_purchases" ON "public"."rep_store_purchases" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage stack pricing
DROP POLICY IF EXISTS "Admins can manage stack pricing" ON "public"."stack_pricing";
CREATE POLICY "Admins can manage stack pricing" ON "public"."stack_pricing" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage stock history
DROP POLICY IF EXISTS "Admins can manage stock history" ON "public"."stock_history";
CREATE POLICY "Admins can manage stock history" ON "public"."stock_history" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage tracking events
DROP POLICY IF EXISTS "Admins can manage tracking events" ON "public"."tracking_events";
CREATE POLICY "Admins can manage tracking events" ON "public"."tracking_events" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can manage wallet_transactions
DROP POLICY IF EXISTS "Admins can manage wallet_transactions" ON "public"."wallet_transactions";
CREATE POLICY "Admins can manage wallet_transactions" ON "public"."wallet_transactions" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can read settings
DROP POLICY IF EXISTS "Admins can read settings" ON "public"."settings";
CREATE POLICY "Admins can read settings" ON "public"."settings" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can update admin notes
DROP POLICY IF EXISTS "Admins can update admin notes" ON "public"."admin_notes";
CREATE POLICY "Admins can update admin notes" ON "public"."admin_notes" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can update all support chat sessions
DROP POLICY IF EXISTS "Admins can update all support chat sessions" ON "public"."support_chat_sessions";
CREATE POLICY "Admins can update all support chat sessions" ON "public"."support_chat_sessions" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can update settings
DROP POLICY IF EXISTS "Admins can update settings" ON "public"."settings";
CREATE POLICY "Admins can update settings" ON "public"."settings" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can update support chat messages
DROP POLICY IF EXISTS "Admins can update support chat messages" ON "public"."support_chat_messages";
CREATE POLICY "Admins can update support chat messages" ON "public"."support_chat_messages" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can update themes
DROP POLICY IF EXISTS "Admins can update themes" ON "public"."themes";
CREATE POLICY "Admins can update themes" ON "public"."themes" FOR UPDATE TO "authenticated" USING (true) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can update unmatched tracking
DROP POLICY IF EXISTS "Admins can update unmatched tracking" ON "public"."unmatched_tracking";
CREATE POLICY "Admins can update unmatched tracking" ON "public"."unmatched_tracking" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view Q&A pairs
DROP POLICY IF EXISTS "Admins can view Q&A pairs" ON "public"."ai_qa_pairs";
CREATE POLICY "Admins can view Q&A pairs" ON "public"."ai_qa_pairs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view all SMS conversations
DROP POLICY IF EXISTS "Admins can view all SMS conversations" ON "public"."sms_conversations";
CREATE POLICY "Admins can view all SMS conversations" ON "public"."sms_conversations" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view all SMS logs
DROP POLICY IF EXISTS "Admins can view all SMS logs" ON "public"."sms_logs";
CREATE POLICY "Admins can view all SMS logs" ON "public"."sms_logs" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view all admin notes
DROP POLICY IF EXISTS "Admins can view all admin notes" ON "public"."admin_notes";
CREATE POLICY "Admins can view all admin notes" ON "public"."admin_notes" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view all conversations
DROP POLICY IF EXISTS "Admins can view all conversations" ON "public"."chat_conversations";
CREATE POLICY "Admins can view all conversations" ON "public"."chat_conversations" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view all crypto messages
DROP POLICY IF EXISTS "Admins can view all crypto messages" ON "public"."crypto_assistant_messages";
CREATE POLICY "Admins can view all crypto messages" ON "public"."crypto_assistant_messages" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view all crypto sessions
DROP POLICY IF EXISTS "Admins can view all crypto sessions" ON "public"."crypto_assistant_sessions";
CREATE POLICY "Admins can view all crypto sessions" ON "public"."crypto_assistant_sessions" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view all messages
DROP POLICY IF EXISTS "Admins can view all messages" ON "public"."customer_messages";
CREATE POLICY "Admins can view all messages" ON "public"."customer_messages" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view all notifications
DROP POLICY IF EXISTS "Admins can view all notifications" ON "public"."notifications";
CREATE POLICY "Admins can view all notifications" ON "public"."notifications" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view all notifications
DROP POLICY IF EXISTS "Admins can view all notifications" ON "public"."product_notifications";
CREATE POLICY "Admins can view all notifications" ON "public"."product_notifications" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view all order tracking
DROP POLICY IF EXISTS "Admins can view all order tracking" ON "public"."order_tracking";
CREATE POLICY "Admins can view all order tracking" ON "public"."order_tracking" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view all support chat messages
DROP POLICY IF EXISTS "Admins can view all support chat messages" ON "public"."support_chat_messages";
CREATE POLICY "Admins can view all support chat messages" ON "public"."support_chat_messages" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view all support chat sessions
DROP POLICY IF EXISTS "Admins can view all support chat sessions" ON "public"."support_chat_sessions";
CREATE POLICY "Admins can view all support chat sessions" ON "public"."support_chat_sessions" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view all unmatched tracking
DROP POLICY IF EXISTS "Admins can view all unmatched tracking" ON "public"."unmatched_tracking";
CREATE POLICY "Admins can view all unmatched tracking" ON "public"."unmatched_tracking" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view all views
DROP POLICY IF EXISTS "Admins can view all views" ON "public"."kb_article_views";
CREATE POLICY "Admins can view all views" ON "public"."kb_article_views" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view discount codes
DROP POLICY IF EXISTS "Admins can view discount codes" ON "public"."discount_codes";
CREATE POLICY "Admins can view discount codes" ON "public"."discount_codes" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view price history
DROP POLICY IF EXISTS "Admins can view price history" ON "public"."price_history";
CREATE POLICY "Admins can view price history" ON "public"."price_history" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view process docs
DROP POLICY IF EXISTS "Admins can view process docs" ON "public"."process_docs";
CREATE POLICY "Admins can view process docs" ON "public"."process_docs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view stock history
DROP POLICY IF EXISTS "Admins can view stock history" ON "public"."stock_history";
CREATE POLICY "Admins can view stock history" ON "public"."stock_history" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins can view tracking events
DROP POLICY IF EXISTS "Admins can view tracking events" ON "public"."tracking_events";
CREATE POLICY "Admins can view tracking events" ON "public"."tracking_events" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Admins full access to commission statements
DROP POLICY IF EXISTS "Admins full access to commission statements" ON "public"."commission_statements";
CREATE POLICY "Admins full access to commission statements" ON "public"."commission_statements" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))));

-- Fix: Authors can create posts
DROP POLICY IF EXISTS "Authors can create posts" ON "public"."posts";
CREATE POLICY "Authors can create posts" ON "public"."posts" FOR INSERT WITH CHECK (((SELECT "auth"."uid"()) = "author_id"));

-- Fix: Authors can delete their own posts
DROP POLICY IF EXISTS "Authors can delete their own posts" ON "public"."posts";
CREATE POLICY "Authors can delete their own posts" ON "public"."posts" FOR DELETE USING (((SELECT "auth"."uid"()) = "author_id"));

-- Fix: Authors can update their own posts
DROP POLICY IF EXISTS "Authors can update their own posts" ON "public"."posts";
CREATE POLICY "Authors can update their own posts" ON "public"."posts" FOR UPDATE USING (((SELECT "auth"."uid"()) = "author_id"));

-- Fix: Authors can view their own posts
DROP POLICY IF EXISTS "Authors can view their own posts" ON "public"."posts";
CREATE POLICY "Authors can view their own posts" ON "public"."posts" FOR SELECT USING (((SELECT "auth"."uid"()) = "author_id"));

-- Fix: Customers can create own wallets
DROP POLICY IF EXISTS "Customers can create own wallets" ON "public"."customer_wallets";
CREATE POLICY "Customers can create own wallets" ON "public"."customer_wallets" FOR INSERT TO "authenticated" WITH CHECK (("customer_id" IN ( SELECT "c"."id"
   FROM ("public"."customers" "c"
     JOIN "public"."users" "u" ON (("c"."user_id" = "u"."id")))
  WHERE ("u"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Customers can delete own wallets
DROP POLICY IF EXISTS "Customers can delete own wallets" ON "public"."customer_wallets";
CREATE POLICY "Customers can delete own wallets" ON "public"."customer_wallets" FOR DELETE TO "authenticated" USING (("customer_id" IN ( SELECT "c"."id"
   FROM ("public"."customers" "c"
     JOIN "public"."users" "u" ON (("c"."user_id" = "u"."id")))
  WHERE ("u"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Customers can record discount usage
DROP POLICY IF EXISTS "Customers can record discount usage" ON "public"."discount_usage";
CREATE POLICY "Customers can record discount usage" ON "public"."discount_usage" FOR INSERT WITH CHECK (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = (SELECT "auth"."uid"())))));

-- Fix: Customers can send messages to their rep
DROP POLICY IF EXISTS "Customers can send messages to their rep" ON "public"."customer_messages";
CREATE POLICY "Customers can send messages to their rep" ON "public"."customer_messages" FOR INSERT WITH CHECK (((("sender_type")::"text" = 'customer'::"text") AND ("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = (SELECT "auth"."uid"()))))));

-- Fix: Customers can update own wallets
DROP POLICY IF EXISTS "Customers can update own wallets" ON "public"."customer_wallets";
CREATE POLICY "Customers can update own wallets" ON "public"."customer_wallets" FOR UPDATE TO "authenticated" USING (("customer_id" IN ( SELECT "c"."id"
   FROM ("public"."customers" "c"
     JOIN "public"."users" "u" ON (("c"."user_id" = "u"."id")))
  WHERE ("u"."auth_id" = (SELECT "auth"."uid"()))))) WITH CHECK (("customer_id" IN ( SELECT "c"."id"
   FROM ("public"."customers" "c"
     JOIN "public"."users" "u" ON (("c"."user_id" = "u"."id")))
  WHERE ("u"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Customers can view own discount usage
DROP POLICY IF EXISTS "Customers can view own discount usage" ON "public"."discount_usage";
CREATE POLICY "Customers can view own discount usage" ON "public"."discount_usage" FOR SELECT USING (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = (SELECT "auth"."uid"())))));

-- Fix: Customers can view own discounts
DROP POLICY IF EXISTS "Customers can view own discounts" ON "public"."customer_assigned_discounts";
CREATE POLICY "Customers can view own discounts" ON "public"."customer_assigned_discounts" FOR SELECT TO "authenticated" USING (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" IN ( SELECT "users"."id"
           FROM "public"."users"
          WHERE ("users"."auth_id" = (SELECT "auth"."uid"())))))));

-- Fix: Customers can view own invoices
DROP POLICY IF EXISTS "Customers can view own invoices" ON "public"."invoices";
CREATE POLICY "Customers can view own invoices" ON "public"."invoices" FOR SELECT USING (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = (SELECT "auth"."uid"())))));

-- Fix: Customers can view own order tracking
DROP POLICY IF EXISTS "Customers can view own order tracking" ON "public"."order_tracking";
CREATE POLICY "Customers can view own order tracking" ON "public"."order_tracking" FOR SELECT USING (("order_id" IN ( SELECT "o"."id"
   FROM ("public"."orders" "o"
     JOIN "public"."customers" "c" ON (("o"."customer_id" = "c"."id")))
  WHERE ("c"."user_id" = (SELECT "auth"."uid"())))));

-- Fix: Customers can view own payment transactions
DROP POLICY IF EXISTS "Customers can view own payment transactions" ON "public"."payment_transactions";
CREATE POLICY "Customers can view own payment transactions" ON "public"."payment_transactions" FOR SELECT USING (("order_id" IN ( SELECT "o"."id"
   FROM ("public"."orders" "o"
     JOIN "public"."customers" "c" ON (("o"."customer_id" = "c"."id")))
  WHERE ("c"."user_id" = (SELECT "auth"."uid"())))));

-- Fix: Customers can view own wallet transactions
DROP POLICY IF EXISTS "Customers can view own wallet transactions" ON "public"."customer_wallet_transactions";
CREATE POLICY "Customers can view own wallet transactions" ON "public"."customer_wallet_transactions" FOR SELECT TO "authenticated" USING (("customer_wallet_id" IN ( SELECT "cw"."id"
   FROM (("public"."customer_wallets" "cw"
     JOIN "public"."customers" "c" ON (("cw"."customer_id" = "c"."id")))
     JOIN "public"."users" "u" ON (("c"."user_id" = "u"."id")))
  WHERE ("u"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Customers can view own wallets
DROP POLICY IF EXISTS "Customers can view own wallets" ON "public"."customer_wallets";
CREATE POLICY "Customers can view own wallets" ON "public"."customer_wallets" FOR SELECT TO "authenticated" USING (("customer_id" IN ( SELECT "c"."id"
   FROM ("public"."customers" "c"
     JOIN "public"."users" "u" ON (("c"."user_id" = "u"."id")))
  WHERE ("u"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Customers can view their messages
DROP POLICY IF EXISTS "Customers can view their messages" ON "public"."customer_messages";
CREATE POLICY "Customers can view their messages" ON "public"."customer_messages" FOR SELECT USING (((("sender_type")::"text" = 'customer'::"text") AND ("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = (SELECT "auth"."uid"()))))));

-- Fix: Public articles viewable by anyone
DROP POLICY IF EXISTS "Public articles viewable by anyone" ON "public"."kb_articles";
CREATE POLICY "Public articles viewable by anyone" ON "public"."kb_articles" FOR SELECT USING ((("status" = 'published'::"text") AND (("visibility" = 'public'::"text") OR (("visibility" = 'customer_only'::"text") AND ((SELECT "auth"."uid"()) IS NOT NULL)) OR (("visibility" = 'rep_only'::"text") AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = ANY ((ARRAY['rep'::character varying, 'admin'::character varying])::"text"[])))))) OR (("visibility" = 'admin_only'::"text") AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))))));

-- Fix: Reps can create rep_store_purchases
DROP POLICY IF EXISTS "Reps can create rep_store_purchases" ON "public"."rep_store_purchases";
CREATE POLICY "Reps can create rep_store_purchases" ON "public"."rep_store_purchases" FOR INSERT TO "authenticated" WITH CHECK (("rep_id" IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Reps can create support tickets
DROP POLICY IF EXISTS "Reps can create support tickets" ON "public"."support_tickets";
CREATE POLICY "Reps can create support tickets" ON "public"."support_tickets" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'rep'::"text")))));

-- Fix: Reps can send messages to their customers
DROP POLICY IF EXISTS "Reps can send messages to their customers" ON "public"."customer_messages";
CREATE POLICY "Reps can send messages to their customers" ON "public"."customer_messages" FOR INSERT WITH CHECK (((("sender_type")::"text" = 'rep'::"text") AND ("rep_id" = (SELECT "auth"."uid"())) AND ("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."rep_id" = (SELECT "auth"."uid"()))))));

-- Fix: Reps can update their own tickets
DROP POLICY IF EXISTS "Reps can update their own tickets" ON "public"."support_tickets";
CREATE POLICY "Reps can update their own tickets" ON "public"."support_tickets" FOR UPDATE TO "authenticated" USING ((("created_by_rep" = (SELECT "auth"."uid"())) OR (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))));

-- Fix: Reps can view assigned customers
DROP POLICY IF EXISTS "Reps can view assigned customers" ON "public"."customers";
CREATE POLICY "Reps can view assigned customers" ON "public"."customers" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'rep'::"text") AND ("customers"."rep_id" = "users"."id")))));

-- Fix: Reps can view orders from assigned customers
DROP POLICY IF EXISTS "Reps can view orders from assigned customers" ON "public"."orders";
CREATE POLICY "Reps can view orders from assigned customers" ON "public"."orders" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."users"
     JOIN "public"."customers" ON (("customers"."rep_id" = "users"."id")))
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'rep'::"text") AND ("orders"."customer_id" = "customers"."id")))));

-- Fix: Reps can view own commission statements
DROP POLICY IF EXISTS "Reps can view own commission statements" ON "public"."commission_statements";
CREATE POLICY "Reps can view own commission statements" ON "public"."commission_statements" FOR SELECT TO "authenticated" USING ((("rep_id" = (SELECT "auth"."uid"())) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'rep'::"text"))))));

-- Fix: Reps can view own payments
DROP POLICY IF EXISTS "Reps can view own payments" ON "public"."rep_commission_payments";
CREATE POLICY "Reps can view own payments" ON "public"."rep_commission_payments" FOR SELECT USING (("rep_id" = (SELECT "auth"."uid"())));

-- Fix: Reps can view own payout_commissions
DROP POLICY IF EXISTS "Reps can view own payout_commissions" ON "public"."payout_commissions";
CREATE POLICY "Reps can view own payout_commissions" ON "public"."payout_commissions" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."rep_payouts" "rp"
     JOIN "public"."users" "u" ON (("u"."id" = "rp"."rep_id")))
  WHERE (("rp"."id" = "payout_commissions"."payout_id") AND ("u"."auth_id" = (SELECT "auth"."uid"()))))));

-- Fix: Reps can view own rep_commissions
DROP POLICY IF EXISTS "Reps can view own rep_commissions" ON "public"."rep_commissions";
CREATE POLICY "Reps can view own rep_commissions" ON "public"."rep_commissions" FOR SELECT TO "authenticated" USING (("rep_id" IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Reps can view own rep_payouts
DROP POLICY IF EXISTS "Reps can view own rep_payouts" ON "public"."rep_payouts";
CREATE POLICY "Reps can view own rep_payouts" ON "public"."rep_payouts" FOR SELECT TO "authenticated" USING (("rep_id" IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Reps can view own rep_store_purchases
DROP POLICY IF EXISTS "Reps can view own rep_store_purchases" ON "public"."rep_store_purchases";
CREATE POLICY "Reps can view own rep_store_purchases" ON "public"."rep_store_purchases" FOR SELECT TO "authenticated" USING (("rep_id" IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Reps can view own wallet
DROP POLICY IF EXISTS "Reps can view own wallet" ON "public"."rep_wallets";
CREATE POLICY "Reps can view own wallet" ON "public"."rep_wallets" FOR SELECT USING (("rep_id" = (SELECT "auth"."uid"())));

-- Fix: Reps can view their assignments
DROP POLICY IF EXISTS "Reps can view their assignments" ON "public"."customer_rep_assignments";
CREATE POLICY "Reps can view their assignments" ON "public"."customer_rep_assignments" FOR SELECT USING (("rep_id" = (SELECT "auth"."uid"())));

-- Fix: Reps can view their customer messages
DROP POLICY IF EXISTS "Reps can view their customer messages" ON "public"."customer_messages";
CREATE POLICY "Reps can view their customer messages" ON "public"."customer_messages" FOR SELECT USING ((("rep_id" = (SELECT "auth"."uid"())) OR ((("sender_type")::"text" = 'customer'::"text") AND ("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."rep_id" = (SELECT "auth"."uid"())))))));

-- Fix: Reps can view their own pricing
DROP POLICY IF EXISTS "Reps can view their own pricing" ON "public"."rep_product_pricing";
CREATE POLICY "Reps can view their own pricing" ON "public"."rep_product_pricing" FOR SELECT TO "authenticated" USING (("rep_id" = (SELECT "auth"."uid"())));

-- Fix: Reps can view their own tickets
DROP POLICY IF EXISTS "Reps can view their own tickets" ON "public"."support_tickets";
CREATE POLICY "Reps can view their own tickets" ON "public"."support_tickets" FOR SELECT TO "authenticated" USING ((("created_by_rep" = (SELECT "auth"."uid"())) OR (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))));

-- Fix: System can create challenges
DROP POLICY IF EXISTS "System can create challenges" ON "public"."webauthn_challenges";
CREATE POLICY "System can create challenges" ON "public"."webauthn_challenges" FOR INSERT WITH CHECK (("user_id" = (SELECT "auth"."uid"())));

-- Fix: System can delete challenges
DROP POLICY IF EXISTS "System can delete challenges" ON "public"."webauthn_challenges";
CREATE POLICY "System can delete challenges" ON "public"."webauthn_challenges" FOR DELETE USING (("user_id" = (SELECT "auth"."uid"())));

-- Fix: System can update challenges
DROP POLICY IF EXISTS "System can update challenges" ON "public"."webauthn_challenges";
CREATE POLICY "System can update challenges" ON "public"."webauthn_challenges" FOR UPDATE USING (("user_id" = (SELECT "auth"."uid"())));

-- Fix: Users can add messages to own tickets
DROP POLICY IF EXISTS "Users can add messages to own tickets" ON "public"."ticket_messages";
CREATE POLICY "Users can add messages to own tickets" ON "public"."ticket_messages" FOR INSERT WITH CHECK (("ticket_id" IN ( SELECT "support_tickets"."id"
   FROM "public"."support_tickets"
  WHERE ("support_tickets"."user_id" = (SELECT "auth"."uid"())))));

-- Fix: Users can add own credentials
DROP POLICY IF EXISTS "Users can add own credentials" ON "public"."webauthn_credentials";
CREATE POLICY "Users can add own credentials" ON "public"."webauthn_credentials" FOR INSERT WITH CHECK (("user_id" = (SELECT "auth"."uid"())));

-- Fix: Users can create message threads
DROP POLICY IF EXISTS "Users can create message threads" ON "public"."message_threads";
CREATE POLICY "Users can create message threads" ON "public"."message_threads" FOR INSERT WITH CHECK (("user_id" = (SELECT "auth"."uid"())));

-- Fix: Users can create messages in own sessions
DROP POLICY IF EXISTS "Users can create messages in own sessions" ON "public"."chat_messages";
CREATE POLICY "Users can create messages in own sessions" ON "public"."chat_messages" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."chat_sessions"
  WHERE (("chat_sessions"."id" = "chat_messages"."session_id") AND ("chat_sessions"."user_id" = (SELECT "auth"."uid"()))))));

-- Fix: Users can create messages in their crypto sessions
DROP POLICY IF EXISTS "Users can create messages in their crypto sessions" ON "public"."crypto_assistant_messages";
CREATE POLICY "Users can create messages in their crypto sessions" ON "public"."crypto_assistant_messages" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."crypto_assistant_sessions"
  WHERE (("crypto_assistant_sessions"."id" = "crypto_assistant_messages"."session_id") AND ("crypto_assistant_sessions"."user_id" = (SELECT "auth"."uid"()))))));

-- Fix: Users can create messages in their sessions
DROP POLICY IF EXISTS "Users can create messages in their sessions" ON "public"."support_chat_messages";
CREATE POLICY "Users can create messages in their sessions" ON "public"."support_chat_messages" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."support_chat_sessions" "cs"
     JOIN "public"."users" "u" ON (("cs"."user_id" = "u"."id")))
  WHERE (("cs"."id" = "support_chat_messages"."chat_session_id") AND ("u"."auth_id" = (SELECT "auth"."uid"()))))));

-- Fix: Users can create messages in their support chat sessions
DROP POLICY IF EXISTS "Users can create messages in their support chat sessions" ON "public"."support_chat_messages";
CREATE POLICY "Users can create messages in their support chat sessions" ON "public"."support_chat_messages" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."support_chat_sessions"
  WHERE (("support_chat_sessions"."id" = "support_chat_messages"."chat_session_id") AND ("support_chat_sessions"."user_id" = (SELECT "auth"."uid"()))))));

-- Fix: Users can create own chat sessions
DROP POLICY IF EXISTS "Users can create own chat sessions" ON "public"."chat_sessions";
CREATE POLICY "Users can create own chat sessions" ON "public"."chat_sessions" FOR INSERT WITH CHECK (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can create support tickets
DROP POLICY IF EXISTS "Users can create support tickets" ON "public"."support_tickets";
CREATE POLICY "Users can create support tickets" ON "public"."support_tickets" FOR INSERT WITH CHECK (("user_id" = (SELECT "auth"."uid"())));

-- Fix: Users can create their own author profile
DROP POLICY IF EXISTS "Users can create their own author profile" ON "public"."authors";
CREATE POLICY "Users can create their own author profile" ON "public"."authors" FOR INSERT WITH CHECK (((SELECT "auth"."uid"()) = "id"));

-- Fix: Users can create their own conversations
DROP POLICY IF EXISTS "Users can create their own conversations" ON "public"."chat_conversations";
CREATE POLICY "Users can create their own conversations" ON "public"."chat_conversations" FOR INSERT WITH CHECK (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can create their own crypto sessions
DROP POLICY IF EXISTS "Users can create their own crypto sessions" ON "public"."crypto_assistant_sessions";
CREATE POLICY "Users can create their own crypto sessions" ON "public"."crypto_assistant_sessions" FOR INSERT WITH CHECK (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can create their own support chat sessions
DROP POLICY IF EXISTS "Users can create their own support chat sessions" ON "public"."support_chat_sessions";
CREATE POLICY "Users can create their own support chat sessions" ON "public"."support_chat_sessions" FOR INSERT WITH CHECK (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can create their own votes
DROP POLICY IF EXISTS "Users can create their own votes" ON "public"."votes";
CREATE POLICY "Users can create their own votes" ON "public"."votes" FOR INSERT WITH CHECK (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can delete messages from their support chat sessions
DROP POLICY IF EXISTS "Users can delete messages from their support chat sessions" ON "public"."support_chat_messages";
CREATE POLICY "Users can delete messages from their support chat sessions" ON "public"."support_chat_messages" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."support_chat_sessions"
  WHERE (("support_chat_sessions"."id" = "support_chat_messages"."chat_session_id") AND ("support_chat_sessions"."user_id" = (SELECT "auth"."uid"()))))));

-- Fix: Users can delete messages in their sessions
DROP POLICY IF EXISTS "Users can delete messages in their sessions" ON "public"."support_chat_messages";
CREATE POLICY "Users can delete messages in their sessions" ON "public"."support_chat_messages" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM ("public"."support_chat_sessions" "cs"
     JOIN "public"."users" "u" ON (("cs"."user_id" = "u"."id")))
  WHERE (("cs"."id" = "support_chat_messages"."chat_session_id") AND ("u"."auth_id" = (SELECT "auth"."uid"()))))));

-- Fix: Users can delete own chat sessions
DROP POLICY IF EXISTS "Users can delete own chat sessions" ON "public"."chat_sessions";
CREATE POLICY "Users can delete own chat sessions" ON "public"."chat_sessions" FOR DELETE USING (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can delete own credentials
DROP POLICY IF EXISTS "Users can delete own credentials" ON "public"."webauthn_credentials";
CREATE POLICY "Users can delete own credentials" ON "public"."webauthn_credentials" FOR DELETE USING (("user_id" = (SELECT "auth"."uid"())));

-- Fix: Users can delete their own cart items
DROP POLICY IF EXISTS "Users can delete their own cart items" ON "public"."cart_items";
CREATE POLICY "Users can delete their own cart items" ON "public"."cart_items" FOR DELETE USING (("user_id" IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Users can delete their own support chat sessions
DROP POLICY IF EXISTS "Users can delete their own support chat sessions" ON "public"."support_chat_sessions";
CREATE POLICY "Users can delete their own support chat sessions" ON "public"."support_chat_sessions" FOR DELETE USING (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can delete their own votes
DROP POLICY IF EXISTS "Users can delete their own votes" ON "public"."votes";
CREATE POLICY "Users can delete their own votes" ON "public"."votes" FOR DELETE USING (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can insert their own cart items
DROP POLICY IF EXISTS "Users can insert their own cart items" ON "public"."cart_items";
CREATE POLICY "Users can insert their own cart items" ON "public"."cart_items" FOR INSERT WITH CHECK (("user_id" IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Users can manage own cart items
DROP POLICY IF EXISTS "Users can manage own cart items" ON "public"."cart_items";
CREATE POLICY "Users can manage own cart items" ON "public"."cart_items" TO "authenticated" USING (("user_id" = (SELECT "auth"."uid"()))) WITH CHECK (("user_id" = (SELECT "auth"."uid"())));

-- Fix: Users can manage own credentials
DROP POLICY IF EXISTS "Users can manage own credentials" ON "public"."webauthn_credentials";
CREATE POLICY "Users can manage own credentials" ON "public"."webauthn_credentials" USING (("user_id" = ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Users can read own record
DROP POLICY IF EXISTS "Users can read own record" ON "public"."users";
CREATE POLICY "Users can read own record" ON "public"."users" FOR SELECT TO "authenticated" USING (("auth_id" = (SELECT "auth"."uid"())));

-- Fix: Users can send messages in own threads
DROP POLICY IF EXISTS "Users can send messages in own threads" ON "public"."messages";
CREATE POLICY "Users can send messages in own threads" ON "public"."messages" FOR INSERT WITH CHECK (("thread_id" IN ( SELECT "message_threads"."id"
   FROM "public"."message_threads"
  WHERE ("message_threads"."user_id" = (SELECT "auth"."uid"())))));

-- Fix: Users can update own chat sessions
DROP POLICY IF EXISTS "Users can update own chat sessions" ON "public"."chat_sessions";
CREATE POLICY "Users can update own chat sessions" ON "public"."chat_sessions" FOR UPDATE USING (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can update own credentials
DROP POLICY IF EXISTS "Users can update own credentials" ON "public"."webauthn_credentials";
CREATE POLICY "Users can update own credentials" ON "public"."webauthn_credentials" FOR UPDATE USING (("user_id" = (SELECT "auth"."uid"())));

-- Fix: Users can update own tickets
DROP POLICY IF EXISTS "Users can update own tickets" ON "public"."support_tickets";
CREATE POLICY "Users can update own tickets" ON "public"."support_tickets" FOR UPDATE USING (("user_id" = (SELECT "auth"."uid"())));

-- Fix: Users can update their own author profile
DROP POLICY IF EXISTS "Users can update their own author profile" ON "public"."authors";
CREATE POLICY "Users can update their own author profile" ON "public"."authors" FOR UPDATE USING (((SELECT "auth"."uid"()) = "id"));

-- Fix: Users can update their own cart items
DROP POLICY IF EXISTS "Users can update their own cart items" ON "public"."cart_items";
CREATE POLICY "Users can update their own cart items" ON "public"."cart_items" FOR UPDATE USING (("user_id" IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Users can update their own conversations
DROP POLICY IF EXISTS "Users can update their own conversations" ON "public"."chat_conversations";
CREATE POLICY "Users can update their own conversations" ON "public"."chat_conversations" FOR UPDATE USING (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can update their own crypto sessions
DROP POLICY IF EXISTS "Users can update their own crypto sessions" ON "public"."crypto_assistant_sessions";
CREATE POLICY "Users can update their own crypto sessions" ON "public"."crypto_assistant_sessions" FOR UPDATE USING (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can update their own notifications
DROP POLICY IF EXISTS "Users can update their own notifications" ON "public"."notifications";
CREATE POLICY "Users can update their own notifications" ON "public"."notifications" FOR UPDATE USING (("user_id" = (SELECT "auth"."uid"()))) WITH CHECK (("user_id" = (SELECT "auth"."uid"())));

-- Fix: Users can update their own support chat sessions
DROP POLICY IF EXISTS "Users can update their own support chat sessions" ON "public"."support_chat_sessions";
CREATE POLICY "Users can update their own support chat sessions" ON "public"."support_chat_sessions" FOR UPDATE USING (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can update their own votes
DROP POLICY IF EXISTS "Users can update their own votes" ON "public"."votes";
CREATE POLICY "Users can update their own votes" ON "public"."votes" FOR UPDATE USING (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can view messages from their support chat sessions
DROP POLICY IF EXISTS "Users can view messages from their support chat sessions" ON "public"."support_chat_messages";
CREATE POLICY "Users can view messages from their support chat sessions" ON "public"."support_chat_messages" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."support_chat_sessions"
  WHERE (("support_chat_sessions"."id" = "support_chat_messages"."chat_session_id") AND (("support_chat_sessions"."user_id" = (SELECT "auth"."uid"())) OR ("support_chat_sessions"."visibility" = 'public'::"text"))))));

-- Fix: Users can view messages in their sessions
DROP POLICY IF EXISTS "Users can view messages in their sessions" ON "public"."support_chat_messages";
CREATE POLICY "Users can view messages in their sessions" ON "public"."support_chat_messages" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."support_chat_sessions" "cs"
     JOIN "public"."users" "u" ON (("cs"."user_id" = "u"."id")))
  WHERE (("cs"."id" = "support_chat_messages"."chat_session_id") AND (("u"."auth_id" = (SELECT "auth"."uid"())) OR ("cs"."visibility" = 'public'::"text"))))));

-- Fix: Users can view own challenges
DROP POLICY IF EXISTS "Users can view own challenges" ON "public"."webauthn_challenges";
CREATE POLICY "Users can view own challenges" ON "public"."webauthn_challenges" FOR SELECT USING (("user_id" = (SELECT "auth"."uid"())));

-- Fix: Users can view own chat messages
DROP POLICY IF EXISTS "Users can view own chat messages" ON "public"."chat_messages";
CREATE POLICY "Users can view own chat messages" ON "public"."chat_messages" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."chat_sessions"
  WHERE (("chat_sessions"."id" = "chat_messages"."session_id") AND ("chat_sessions"."user_id" = (SELECT "auth"."uid"()))))));

-- Fix: Users can view own chat sessions
DROP POLICY IF EXISTS "Users can view own chat sessions" ON "public"."chat_sessions";
CREATE POLICY "Users can view own chat sessions" ON "public"."chat_sessions" FOR SELECT USING (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can view own credentials
DROP POLICY IF EXISTS "Users can view own credentials" ON "public"."webauthn_credentials";
CREATE POLICY "Users can view own credentials" ON "public"."webauthn_credentials" FOR SELECT USING (("user_id" = ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Users can view own message threads
DROP POLICY IF EXISTS "Users can view own message threads" ON "public"."message_threads";
CREATE POLICY "Users can view own message threads" ON "public"."message_threads" FOR SELECT USING (("user_id" = (SELECT "auth"."uid"())));

-- Fix: Users can view own messages
DROP POLICY IF EXISTS "Users can view own messages" ON "public"."messages";
CREATE POLICY "Users can view own messages" ON "public"."messages" FOR SELECT USING (("thread_id" IN ( SELECT "message_threads"."id"
   FROM "public"."message_threads"
  WHERE ("message_threads"."user_id" = (SELECT "auth"."uid"())))));

-- Fix: Users can view own support tickets
DROP POLICY IF EXISTS "Users can view own support tickets" ON "public"."support_tickets";
CREATE POLICY "Users can view own support tickets" ON "public"."support_tickets" FOR SELECT USING (("user_id" = (SELECT "auth"."uid"())));

-- Fix: Users can view own ticket messages
DROP POLICY IF EXISTS "Users can view own ticket messages" ON "public"."ticket_messages";
CREATE POLICY "Users can view own ticket messages" ON "public"."ticket_messages" FOR SELECT USING (("ticket_id" IN ( SELECT "support_tickets"."id"
   FROM "public"."support_tickets"
  WHERE ("support_tickets"."user_id" = (SELECT "auth"."uid"())))));

-- Fix: Users can view their own cart items
DROP POLICY IF EXISTS "Users can view their own cart items" ON "public"."cart_items";
CREATE POLICY "Users can view their own cart items" ON "public"."cart_items" FOR SELECT USING (("user_id" IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Users can view their own conversations
DROP POLICY IF EXISTS "Users can view their own conversations" ON "public"."chat_conversations";
CREATE POLICY "Users can view their own conversations" ON "public"."chat_conversations" FOR SELECT USING (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can view their own crypto messages
DROP POLICY IF EXISTS "Users can view their own crypto messages" ON "public"."crypto_assistant_messages";
CREATE POLICY "Users can view their own crypto messages" ON "public"."crypto_assistant_messages" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."crypto_assistant_sessions"
  WHERE (("crypto_assistant_sessions"."id" = "crypto_assistant_messages"."session_id") AND ("crypto_assistant_sessions"."user_id" = (SELECT "auth"."uid"()))))));

-- Fix: Users can view their own crypto sessions
DROP POLICY IF EXISTS "Users can view their own crypto sessions" ON "public"."crypto_assistant_sessions";
CREATE POLICY "Users can view their own crypto sessions" ON "public"."crypto_assistant_sessions" FOR SELECT USING (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: Users can view their own documents
DROP POLICY IF EXISTS "Users can view their own documents" ON "public"."documents";
CREATE POLICY "Users can view their own documents" ON "public"."documents" FOR SELECT USING (("user_id" IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_id" = (SELECT "auth"."uid"())))));

-- Fix: Users can view their own feedback
DROP POLICY IF EXISTS "Users can view their own feedback" ON "public"."kb_article_feedback";
CREATE POLICY "Users can view their own feedback" ON "public"."kb_article_feedback" FOR SELECT USING ((("user_id" IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_id" = (SELECT "auth"."uid"())))) OR (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."auth_id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text"))))));

-- Fix: Users can view their own notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON "public"."notifications";
CREATE POLICY "Users can view their own notifications" ON "public"."notifications" FOR SELECT USING (("user_id" = (SELECT "auth"."uid"())));

-- Fix: Users can view their own support chat sessions
DROP POLICY IF EXISTS "Users can view their own support chat sessions" ON "public"."support_chat_sessions";
CREATE POLICY "Users can view their own support chat sessions" ON "public"."support_chat_sessions" FOR SELECT USING (((SELECT "auth"."uid"()) = "user_id"));

-- Fix: View payment commission links
DROP POLICY IF EXISTS "View payment commission links" ON "public"."payment_commissions";
CREATE POLICY "View payment commission links" ON "public"."payment_commissions" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."rep_commission_payments" "p"
  WHERE (("p"."id" = "payment_commissions"."payment_id") AND (("p"."rep_id" = (SELECT "auth"."uid"())) OR (EXISTS ( SELECT 1
           FROM "public"."users"
          WHERE (("users"."id" = (SELECT "auth"."uid"())) AND (("users"."role")::"text" = 'admin'::"text")))))))));
