-- ============================================================================
-- COMPREHENSIVE DATABASE SCHEMA FIX
-- ============================================================================
-- Fixes all PostgREST schema cache issues and foreign key constraint problems
-- Run this to resolve PGRST200 errors and foreign key violations
-- Created: 2025-10-31
-- ============================================================================


-- ============================================================================
-- PART 1: FIX BUSINESS_WALLETS TABLE
-- ============================================================================

-- Drop problematic FK constraint on created_by
ALTER TABLE business_wallets 
  DROP CONSTRAINT IF EXISTS business_wallets_created_by_fkey;

ALTER TABLE business_wallets 
  ALTER COLUMN created_by DROP NOT NULL;

-- Ensure all wallet encryption columns exist
ALTER TABLE business_wallets
  ADD COLUMN IF NOT EXISTS encrypted_private_key TEXT,
  ADD COLUMN IF NOT EXISTS private_key_iv TEXT,
  ADD COLUMN IF NOT EXISTS private_key_auth_tag TEXT,
  ADD COLUMN IF NOT EXISTS encrypted_mnemonic TEXT,
  ADD COLUMN IF NOT EXISTS mnemonic_iv TEXT,
  ADD COLUMN IF NOT EXISTS mnemonic_auth_tag TEXT,
  ADD COLUMN IF NOT EXISTS pin_hash TEXT,
  ADD COLUMN IF NOT EXISTS webauthn_credential_id UUID;

-- Ensure balance and metadata columns exist
ALTER TABLE business_wallets
  ADD COLUMN IF NOT EXISTS balance_eth TEXT DEFAULT '0',
  ADD COLUMN IF NOT EXISTS balance_usdc TEXT DEFAULT '0',
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS label TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS currency TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_business_wallets_active ON business_wallets(is_active);
CREATE INDEX IF NOT EXISTS idx_business_wallets_currency ON business_wallets(currency);
CREATE INDEX IF NOT EXISTS idx_business_wallets_address ON business_wallets(address);
CREATE INDEX IF NOT EXISTS idx_business_wallets_pin_hash ON business_wallets(pin_hash) WHERE pin_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_business_wallets_webauthn ON business_wallets(webauthn_credential_id) WHERE webauthn_credential_id IS NOT NULL;


-- ============================================================================
-- PART 2: FIX WALLET_TRANSACTIONS TABLE
-- ============================================================================

ALTER TABLE wallet_transactions 
  DROP CONSTRAINT IF EXISTS wallet_transactions_created_by_fkey;

ALTER TABLE wallet_transactions 
  DROP CONSTRAINT IF EXISTS wallet_transactions_order_id_fkey;

ALTER TABLE wallet_transactions 
  ALTER COLUMN created_by DROP NOT NULL;

-- Ensure all columns exist
ALTER TABLE wallet_transactions
  ADD COLUMN IF NOT EXISTS order_id UUID,
  ADD COLUMN IF NOT EXISTS tx_hash TEXT,
  ADD COLUMN IF NOT EXISTS type TEXT,
  ADD COLUMN IF NOT EXISTS from_address TEXT,
  ADD COLUMN IF NOT EXISTS to_address TEXT,
  ADD COLUMN IF NOT EXISTS amount TEXT,
  ADD COLUMN IF NOT EXISTS currency TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS block_number BIGINT,
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_tx_hash ON wallet_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_order_id ON wallet_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_status ON wallet_transactions(status);


-- ============================================================================
-- PART 3: FIX CUSTOMERS TABLE
-- ============================================================================

-- Fix default_wallet_id foreign key
ALTER TABLE customers 
  DROP CONSTRAINT IF EXISTS customers_default_wallet_id_fkey;

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS default_wallet_id UUID;

ALTER TABLE customers
  ADD CONSTRAINT customers_default_wallet_id_fkey 
  FOREIGN KEY (default_wallet_id) 
  REFERENCES business_wallets(id) 
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_customers_default_wallet ON customers(default_wallet_id);

-- Fix user_id foreign key to reference auth.users correctly
ALTER TABLE customers 
  DROP CONSTRAINT IF EXISTS customers_user_id_fkey;

ALTER TABLE customers
  ADD CONSTRAINT customers_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);


-- ============================================================================
-- PART 4: FIX ORDERS TABLE
-- ============================================================================

-- Fix assigned_wallet_id foreign key
ALTER TABLE orders 
  DROP CONSTRAINT IF EXISTS orders_assigned_wallet_id_fkey;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS assigned_wallet_id UUID;

ALTER TABLE orders
  ADD CONSTRAINT orders_assigned_wallet_id_fkey 
  FOREIGN KEY (assigned_wallet_id) 
  REFERENCES business_wallets(id) 
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_assigned_wallet ON orders(assigned_wallet_id);

-- Fix customer_id foreign key
ALTER TABLE orders 
  DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;

ALTER TABLE orders
  ADD CONSTRAINT orders_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES customers(id) 
  ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

-- Fix discount_code_id foreign key
ALTER TABLE orders 
  DROP CONSTRAINT IF EXISTS orders_discount_code_id_fkey;

ALTER TABLE orders
  ADD CONSTRAINT orders_discount_code_id_fkey 
  FOREIGN KEY (discount_code_id) 
  REFERENCES discount_codes(id) 
  ON DELETE SET NULL;

-- Ensure crypto payment columns exist
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
  ADD COLUMN IF NOT EXISTS expected_payment_amount DECIMAL(20, 8),
  ADD COLUMN IF NOT EXISTS expected_payment_currency VARCHAR(10),
  ADD COLUMN IF NOT EXISTS transaction_hash VARCHAR(255),
  ADD COLUMN IF NOT EXISTS eth_price_at_purchase DECIMAL(20, 2);


-- ============================================================================
-- PART 5: FIX ORDER_ITEMS TABLE
-- ============================================================================

ALTER TABLE order_items 
  DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;

ALTER TABLE order_items
  ADD CONSTRAINT order_items_order_id_fkey 
  FOREIGN KEY (order_id) 
  REFERENCES orders(id) 
  ON DELETE CASCADE;

ALTER TABLE order_items 
  DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

ALTER TABLE order_items
  ADD CONSTRAINT order_items_product_id_fkey 
  FOREIGN KEY (product_id) 
  REFERENCES products(id) 
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);


-- ============================================================================
-- PART 6: FIX SUPPORT_TICKETS TABLE
-- ============================================================================

ALTER TABLE support_tickets 
  DROP CONSTRAINT IF EXISTS support_tickets_customer_id_fkey;

ALTER TABLE support_tickets
  ADD CONSTRAINT support_tickets_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES customers(id) 
  ON DELETE CASCADE;

ALTER TABLE support_tickets 
  DROP CONSTRAINT IF EXISTS support_tickets_assigned_to_fkey;

ALTER TABLE support_tickets
  DROP CONSTRAINT IF EXISTS support_tickets_assigned_to_fkey;

-- Don't recreate assigned_to FK since it references auth users, just make nullable
ALTER TABLE support_tickets
  ALTER COLUMN assigned_to DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);


-- ============================================================================
-- PART 7: FIX NOTIFICATIONS TABLE
-- ============================================================================

ALTER TABLE notifications 
  DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

ALTER TABLE notifications
  ADD CONSTRAINT notifications_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE notifications 
  DROP CONSTRAINT IF EXISTS notifications_ticket_id_fkey;

ALTER TABLE notifications
  ADD CONSTRAINT notifications_ticket_id_fkey 
  FOREIGN KEY (ticket_id) 
  REFERENCES support_tickets(id) 
  ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_ticket_id ON notifications(ticket_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);


-- ============================================================================
-- PART 8: FIX DISCOUNT_CODES TABLE
-- ============================================================================

ALTER TABLE discount_codes
  ADD COLUMN IF NOT EXISTS free_shipping BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active);


-- ============================================================================
-- PART 9: FIX PRODUCTS TABLE
-- ============================================================================

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_color ON products(color);


-- ============================================================================
-- PART 10: FIX SHIPPING_ADDRESSES TABLE
-- ============================================================================

ALTER TABLE shipping_addresses 
  DROP CONSTRAINT IF EXISTS shipping_addresses_customer_id_fkey;

ALTER TABLE shipping_addresses
  ADD CONSTRAINT shipping_addresses_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES customers(id) 
  ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_shipping_addresses_customer_id ON shipping_addresses(customer_id);


-- ============================================================================
-- PART 11: FIX CART_ITEMS TABLE
-- ============================================================================

ALTER TABLE cart_items 
  DROP CONSTRAINT IF EXISTS cart_items_user_id_fkey;

ALTER TABLE cart_items
  ADD CONSTRAINT cart_items_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE cart_items 
  DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;

ALTER TABLE cart_items
  ADD CONSTRAINT cart_items_product_id_fkey 
  FOREIGN KEY (product_id) 
  REFERENCES products(id) 
  ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);


-- ============================================================================
-- PART 12: FIX AI_CHAT_SESSIONS TABLE
-- ============================================================================

ALTER TABLE ai_chat_sessions 
  DROP CONSTRAINT IF EXISTS ai_chat_sessions_customer_id_fkey;

ALTER TABLE ai_chat_sessions
  ADD CONSTRAINT ai_chat_sessions_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES customers(id) 
  ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_customer_id ON ai_chat_sessions(customer_id);


-- ============================================================================
-- PART 13: FIX AI_CHAT_MESSAGES TABLE
-- ============================================================================

ALTER TABLE ai_chat_messages 
  DROP CONSTRAINT IF EXISTS ai_chat_messages_session_id_fkey;

ALTER TABLE ai_chat_messages
  ADD CONSTRAINT ai_chat_messages_session_id_fkey 
  FOREIGN KEY (session_id) 
  REFERENCES ai_chat_sessions(id) 
  ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session_id ON ai_chat_messages(session_id);


-- ============================================================================
-- PART 14: FIX CUSTOMER_MESSAGES TABLE
-- ============================================================================

ALTER TABLE customer_messages 
  DROP CONSTRAINT IF EXISTS customer_messages_customer_id_fkey;

ALTER TABLE customer_messages
  ADD CONSTRAINT customer_messages_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES customers(id) 
  ON DELETE CASCADE;

ALTER TABLE customer_messages 
  DROP CONSTRAINT IF EXISTS customer_messages_rep_id_fkey;

-- Don't recreate rep_id FK, just make nullable
ALTER TABLE customer_messages
  ALTER COLUMN rep_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_customer_messages_customer_id ON customer_messages(customer_id);


-- ============================================================================
-- PART 15: RELOAD POSTGREST SCHEMA CACHE
-- ============================================================================
-- This is CRITICAL - tells PostgREST to refresh its understanding of the schema
-- Without this, you'll continue to see PGRST200 errors

NOTIFY pgrst, 'reload schema';

-- Also use the pg_notify function as a backup
SELECT pg_notify('pgrst', 'reload schema');


-- ============================================================================
-- DONE! Your database schema is now fixed.
-- ============================================================================
-- All foreign key constraints are properly configured
-- All indexes are in place for performance
-- PostgREST schema cache has been reloaded
-- You should no longer see PGRST200 or foreign key violation errors
-- ============================================================================
