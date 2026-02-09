-- Stripe Payment Events Table
-- Captures all payment-related events from Stripe webhooks with timestamps

CREATE TABLE IF NOT EXISTS stripe_payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  stripe_event_id TEXT UNIQUE NOT NULL, -- Stripe event ID for idempotency
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  event_type TEXT NOT NULL, -- payment_intent.succeeded, payment_intent.payment_failed, checkout.session.completed, etc.
  status TEXT NOT NULL, -- succeeded, failed, pending, canceled, requires_action
  amount INTEGER, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  failure_code TEXT, -- Stripe failure code if failed
  failure_message TEXT, -- Human-readable failure message
  payment_method_type TEXT, -- card, bank_transfer, ach, etc.
  payment_method_last4 TEXT, -- Last 4 digits of card/account
  payment_method_brand TEXT, -- visa, mastercard, amex, etc.
  customer_email TEXT,
  receipt_url TEXT, -- Stripe receipt URL
  raw_event JSONB, -- Full Stripe event payload for debugging
  event_timestamp TIMESTAMPTZ NOT NULL, -- When Stripe recorded the event
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_stripe_events_order ON stripe_payment_events(order_id);
CREATE INDEX IF NOT EXISTS idx_stripe_events_payment_intent ON stripe_payment_events(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_stripe_events_checkout_session ON stripe_payment_events(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_stripe_events_event_type ON stripe_payment_events(event_type);
CREATE INDEX IF NOT EXISTS idx_stripe_events_status ON stripe_payment_events(status);
CREATE INDEX IF NOT EXISTS idx_stripe_events_created ON stripe_payment_events(created_at DESC);

-- Enable RLS
ALTER TABLE stripe_payment_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "stripe_events_admin" ON stripe_payment_events 
  FOR ALL TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "stripe_events_service" ON stripe_payment_events 
  FOR ALL TO service_role 
  USING (true) 
  WITH CHECK (true);

-- Add columns to orders table if they don't exist
DO $$ 
BEGIN
  -- Add payment_failed_at column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'payment_failed_at') THEN
    ALTER TABLE orders ADD COLUMN payment_failed_at TIMESTAMPTZ;
  END IF;
  
  -- Add payment_failure_reason column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'payment_failure_reason') THEN
    ALTER TABLE orders ADD COLUMN payment_failure_reason TEXT;
  END IF;
  
  -- Add stripe_checkout_session_id column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'stripe_checkout_session_id') THEN
    ALTER TABLE orders ADD COLUMN stripe_checkout_session_id TEXT;
  END IF;
  
  -- Add payment_method_details column for storing card info
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'payment_method_details') THEN
    ALTER TABLE orders ADD COLUMN payment_method_details JSONB;
  END IF;
  
  -- Add stripe_receipt_url column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'stripe_receipt_url') THEN
    ALTER TABLE orders ADD COLUMN stripe_receipt_url TEXT;
  END IF;
END $$;

-- Create index on stripe_checkout_session_id
CREATE INDEX IF NOT EXISTS idx_orders_checkout_session ON orders(stripe_checkout_session_id) 
  WHERE stripe_checkout_session_id IS NOT NULL;

COMMENT ON TABLE stripe_payment_events IS 'Tracks all Stripe payment events for orders with detailed timestamps and status information';

