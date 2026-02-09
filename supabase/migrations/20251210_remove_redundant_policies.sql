-- Drop redundant 'view' policies (already covered by 'manage' policies)
-- Total: 32 policies to drop

DROP POLICY IF EXISTS "Admins can view Q&A pairs" ON "public"."ai_qa_pairs";
DROP POLICY IF EXISTS "Authenticated users can view active wallets" ON "public"."business_wallets";
DROP POLICY IF EXISTS "Users can view their own cart items" ON "public"."cart_items";
DROP POLICY IF EXISTS "Anyone can view categories" ON "public"."categories";
DROP POLICY IF EXISTS "Customers can view own discounts" ON "public"."customer_assigned_discounts";
DROP POLICY IF EXISTS "Reps can view their assignments" ON "public"."customer_rep_assignments";
DROP POLICY IF EXISTS "Customers can view own wallet transactions" ON "public"."customer_wallet_transactions";
DROP POLICY IF EXISTS "Customers can view own wallets" ON "public"."customer_wallets";
DROP POLICY IF EXISTS "Admins can view discount codes" ON "public"."discount_codes";
DROP POLICY IF EXISTS "Customers can view own invoices" ON "public"."invoices";
DROP POLICY IF EXISTS "Public articles viewable by anyone" ON "public"."kb_articles";
DROP POLICY IF EXISTS "Anyone can view categories" ON "public"."kb_categories";
DROP POLICY IF EXISTS "Users can view own message threads" ON "public"."message_threads";
DROP POLICY IF EXISTS "Users can view own messages" ON "public"."messages";
DROP POLICY IF EXISTS "Customers can view own payment transactions" ON "public"."payment_transactions";
DROP POLICY IF EXISTS "Reps can view own payout_commissions" ON "public"."payout_commissions";
DROP POLICY IF EXISTS "Admins can view price history" ON "public"."price_history";
DROP POLICY IF EXISTS "Admins can view process docs" ON "public"."process_docs";
DROP POLICY IF EXISTS "Admins can view all notifications" ON "public"."product_notifications";
DROP POLICY IF EXISTS "Customers can view active product stacks" ON "public"."product_stacks";
DROP POLICY IF EXISTS "Authenticated users can view products" ON "public"."products";
DROP POLICY IF EXISTS "Reps can view own payments" ON "public"."rep_commission_payments";
DROP POLICY IF EXISTS "Reps can view own rep_commissions" ON "public"."rep_commissions";
DROP POLICY IF EXISTS "Reps can view own rep_payouts" ON "public"."rep_payouts";
DROP POLICY IF EXISTS "Reps can view their own pricing" ON "public"."rep_product_pricing";
DROP POLICY IF EXISTS "Reps can view own rep_store_purchases" ON "public"."rep_store_purchases";
DROP POLICY IF EXISTS "Reps can view own wallet" ON "public"."rep_wallets";
DROP POLICY IF EXISTS "Customers can view active stack pricing" ON "public"."stack_pricing";
DROP POLICY IF EXISTS "Admins can view stock history" ON "public"."stock_history";
DROP POLICY IF EXISTS "Users can view own support tickets" ON "public"."support_tickets";
DROP POLICY IF EXISTS "Users can view own ticket messages" ON "public"."ticket_messages";
DROP POLICY IF EXISTS "Admins can view tracking events" ON "public"."tracking_events";