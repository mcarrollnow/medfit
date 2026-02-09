-- =====================================================
-- ADD INDEXES FOR UNINDEXED FOREIGN KEYS
-- =====================================================
-- This improves JOIN and constraint check performance
-- Reference: https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys
--
-- Total indexes added: 51
-- =====================================================

-- Index for ai_proposed_actions.reviewed_by
CREATE INDEX IF NOT EXISTS idx_ai_proposed_actions_reviewed_by ON public.ai_proposed_actions(reviewed_by);

-- Index for ai_qa_pairs.created_by
CREATE INDEX IF NOT EXISTS idx_ai_qa_pairs_created_by ON public.ai_qa_pairs(created_by);

-- Index for commission_statements.created_by
CREATE INDEX IF NOT EXISTS idx_commission_statements_created_by ON public.commission_statements(created_by);

-- Index for customer_assigned_discounts.assigned_by_admin_id
CREATE INDEX IF NOT EXISTS idx_customer_assigned_discounts_assigned_by_admin_id ON public.customer_assigned_discounts(assigned_by_admin_id);

-- Index for customer_assigned_discounts.discount_code_id
CREATE INDEX IF NOT EXISTS idx_customer_assigned_discounts_discount_code_id ON public.customer_assigned_discounts(discount_code_id);

-- Index for customer_assigned_discounts.removed_by_id
CREATE INDEX IF NOT EXISTS idx_customer_assigned_discounts_removed_by_id ON public.customer_assigned_discounts(removed_by_id);

-- Index for customer_assigned_discounts.used_on_order_id
CREATE INDEX IF NOT EXISTS idx_customer_assigned_discounts_used_on_order_id ON public.customer_assigned_discounts(used_on_order_id);

-- Index for customer_rep_assignments.assigned_by
CREATE INDEX IF NOT EXISTS idx_customer_rep_assignments_assigned_by ON public.customer_rep_assignments(assigned_by);

-- Index for customers.referred_by_customer_id
CREATE INDEX IF NOT EXISTS idx_customers_referred_by_customer_id ON public.customers(referred_by_customer_id);

-- Index for discount_codes.created_by
CREATE INDEX IF NOT EXISTS idx_discount_codes_created_by ON public.discount_codes(created_by);

-- Index for discount_usage.order_id
CREATE INDEX IF NOT EXISTS idx_discount_usage_order_id ON public.discount_usage(order_id);

-- Index for invoices.order_id
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON public.invoices(order_id);

-- Index for kb_article_feedback.user_id
CREATE INDEX IF NOT EXISTS idx_kb_article_feedback_user_id ON public.kb_article_feedback(user_id);

-- Index for kb_article_views.user_id
CREATE INDEX IF NOT EXISTS idx_kb_article_views_user_id ON public.kb_article_views(user_id);

-- Index for message_threads.order_id
CREATE INDEX IF NOT EXISTS idx_message_threads_order_id ON public.message_threads(order_id);

-- Index for messages.sender_id
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

-- Index for payment_commissions.commission_id
CREATE INDEX IF NOT EXISTS idx_payment_commissions_commission_id ON public.payment_commissions(commission_id);

-- Index for payout_commissions.commission_id
CREATE INDEX IF NOT EXISTS idx_payout_commissions_commission_id ON public.payout_commissions(commission_id);

-- Index for points_adjustments.customer_id
CREATE INDEX IF NOT EXISTS idx_points_adjustments_customer_id ON public.points_adjustments(customer_id);

-- Index for points_transactions.customer_id
CREATE INDEX IF NOT EXISTS idx_points_transactions_customer_id ON public.points_transactions(customer_id);

-- Index for points_transactions.order_id
CREATE INDEX IF NOT EXISTS idx_points_transactions_order_id ON public.points_transactions(order_id);

-- Index for points_transactions.promo_id
CREATE INDEX IF NOT EXISTS idx_points_transactions_promo_id ON public.points_transactions(promo_id);

-- Index for price_history.changed_by
CREATE INDEX IF NOT EXISTS idx_price_history_changed_by ON public.price_history(changed_by);

-- Index for price_history.product_id
CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON public.price_history(product_id);

-- Index for process_docs.created_by
CREATE INDEX IF NOT EXISTS idx_process_docs_created_by ON public.process_docs(created_by);

-- Index for referral_tracking.order_id
CREATE INDEX IF NOT EXISTS idx_referral_tracking_order_id ON public.referral_tracking(order_id);

-- Index for rep_commission_payments.admin_id
CREATE INDEX IF NOT EXISTS idx_rep_commission_payments_admin_id ON public.rep_commission_payments(admin_id);

-- Index for rep_commission_payments.source_wallet_id
CREATE INDEX IF NOT EXISTS idx_rep_commission_payments_source_wallet_id ON public.rep_commission_payments(source_wallet_id);

-- Index for rep_commissions.order_id
CREATE INDEX IF NOT EXISTS idx_rep_commissions_order_id ON public.rep_commissions(order_id);

-- Index for rep_payouts.processed_by
CREATE INDEX IF NOT EXISTS idx_rep_payouts_processed_by ON public.rep_payouts(processed_by);

-- Index for rep_ratings.order_id
CREATE INDEX IF NOT EXISTS idx_rep_ratings_order_id ON public.rep_ratings(order_id);

-- Index for rep_store_purchases.order_id
CREATE INDEX IF NOT EXISTS idx_rep_store_purchases_order_id ON public.rep_store_purchases(order_id);

-- Index for reward_redemptions.applied_to_order_id
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_applied_to_order_id ON public.reward_redemptions(applied_to_order_id);

-- Index for reward_redemptions.customer_id
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_customer_id ON public.reward_redemptions(customer_id);

-- Index for reward_redemptions.reward_id
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_reward_id ON public.reward_redemptions(reward_id);

-- Index for settings.updated_by
CREATE INDEX IF NOT EXISTS idx_settings_updated_by ON public.settings(updated_by);

-- Index for shipment_items.product_id
CREATE INDEX IF NOT EXISTS idx_shipment_items_product_id ON public.shipment_items(product_id);

-- Index for shipment_items.shipment_id
CREATE INDEX IF NOT EXISTS idx_shipment_items_shipment_id ON public.shipment_items(shipment_id);

-- Index for sms_logs.order_id
CREATE INDEX IF NOT EXISTS idx_sms_logs_order_id ON public.sms_logs(order_id);

-- Index for sms_logs.sent_by_user_id
CREATE INDEX IF NOT EXISTS idx_sms_logs_sent_by_user_id ON public.sms_logs(sent_by_user_id);

-- Index for sms_logs.ticket_id
CREATE INDEX IF NOT EXISTS idx_sms_logs_ticket_id ON public.sms_logs(ticket_id);

-- Index for sms_sessions.customer_id
CREATE INDEX IF NOT EXISTS idx_sms_sessions_customer_id ON public.sms_sessions(customer_id);

-- Index for stack_pricing.created_by
CREATE INDEX IF NOT EXISTS idx_stack_pricing_created_by ON public.stack_pricing(created_by);

-- Index for stock_history.created_by
CREATE INDEX IF NOT EXISTS idx_stock_history_created_by ON public.stock_history(created_by);

-- Index for stock_history.product_id
CREATE INDEX IF NOT EXISTS idx_stock_history_product_id ON public.stock_history(product_id);

-- Index for support_tickets.assigned_to
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON public.support_tickets(assigned_to);

-- Index for tariff_records.payment_id
CREATE INDEX IF NOT EXISTS idx_tariff_records_payment_id ON public.tariff_records(payment_id);

-- Index for ticket_messages.user_id
CREATE INDEX IF NOT EXISTS idx_ticket_messages_user_id ON public.ticket_messages(user_id);

-- Index for unmatched_tracking.matched_order_id
CREATE INDEX IF NOT EXISTS idx_unmatched_tracking_matched_order_id ON public.unmatched_tracking(matched_order_id);

-- Index for votes.chat_session_id
CREATE INDEX IF NOT EXISTS idx_votes_chat_session_id ON public.votes(chat_session_id);

-- Index for votes.user_id
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);
