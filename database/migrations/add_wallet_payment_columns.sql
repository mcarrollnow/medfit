-- Migration: Add metadata and payment tracking columns for wallet payments
-- Date: 2025-12-08
-- Purpose: Clean data structure for customer wallet transactions and payment tracking

-- ============================================
-- 1. Add metadata column to customer_wallet_transactions
-- ============================================
-- This stores structured transaction data like order references,
-- verification methods, exchange rates, and blockchain details

ALTER TABLE customer_wallet_transactions 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add index for querying by order_id within metadata
CREATE INDEX IF NOT EXISTS idx_wallet_tx_metadata_order_id 
ON customer_wallet_transactions ((metadata->>'order_id'));

-- Add index for querying by verification method
CREATE INDEX IF NOT EXISTS idx_wallet_tx_metadata_verification 
ON customer_wallet_transactions ((metadata->>'verification_method'));

COMMENT ON COLUMN customer_wallet_transactions.metadata IS 
'Structured transaction data: order_id, customer_id, verification_method, usd_amount, exchange_rate, network, gas_fee, device_info, error_details';

-- ============================================
-- 2. Add payment_reference column to orders
-- ============================================
-- Dedicated field for tracking payment references from wallet payments

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_reference TEXT;

-- Add index for looking up orders by payment reference
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference 
ON orders (payment_reference) 
WHERE payment_reference IS NOT NULL;

COMMENT ON COLUMN orders.payment_reference IS 
'Payment reference ID from wallet or external payment processor (e.g., PAY-1234567890-ABCD)';

-- ============================================
-- 3. Verify the changes
-- ============================================
-- Run this to confirm columns were added:

SELECT 
  'customer_wallet_transactions' as table_name,
  column_name, 
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_name = 'customer_wallet_transactions' 
  AND column_name = 'metadata'

UNION ALL

SELECT 
  'orders' as table_name,
  column_name, 
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name = 'payment_reference';


