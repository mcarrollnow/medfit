-- Add Authorize.net support to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS authorize_net_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'stripe';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_authorize_net_transaction_id 
ON orders(authorize_net_transaction_id) 
WHERE authorize_net_transaction_id IS NOT NULL;

-- Create generic payment events table (replaces stripe_payment_events for multi-provider support)
CREATE TABLE IF NOT EXISTS payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'authorize_net', -- 'stripe', 'authorize_net', etc.
  event_id TEXT, -- Provider's event/notification ID
  transaction_id TEXT, -- Provider's transaction ID
  event_type TEXT NOT NULL,
  status TEXT NOT NULL,
  amount INTEGER, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  payment_method_type TEXT,
  payment_method_last4 TEXT,
  payment_method_brand TEXT,
  auth_code TEXT,
  avs_result TEXT,
  cvv_result TEXT,
  failure_code TEXT,
  failure_message TEXT,
  customer_email TEXT,
  receipt_url TEXT,
  raw_event JSONB,
  event_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for payment events
CREATE INDEX IF NOT EXISTS idx_payment_events_order_id ON payment_events(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_transaction_id ON payment_events(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_provider ON payment_events(provider);
CREATE INDEX IF NOT EXISTS idx_payment_events_created_at ON payment_events(created_at DESC);

-- Enable RLS
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all payment events
CREATE POLICY "Admins can view all payment events"
  ON payment_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Allow admins to insert payment events (for manual entries)
CREATE POLICY "Admins can insert payment events"
  ON payment_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Comment for documentation
COMMENT ON TABLE payment_events IS 'Unified payment events table supporting multiple payment providers (Stripe, Authorize.net, etc.)';
COMMENT ON COLUMN payment_events.provider IS 'Payment provider: stripe, authorize_net, etc.';
COMMENT ON COLUMN payment_events.transaction_id IS 'Provider-specific transaction ID (Stripe payment_intent_id or Authorize.net transId)';
