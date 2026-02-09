-- Create table to track Alchemy webhook events for auditing and debugging
CREATE TABLE IF NOT EXISTS alchemy_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE, -- Alchemy's webhook event ID
  webhook_id TEXT NOT NULL, -- Alchemy's webhook ID
  event_type TEXT NOT NULL, -- ADDRESS_ACTIVITY, etc.
  network TEXT NOT NULL, -- ETH_MAINNET, POLYGON_MAINNET, etc.
  transactions_count INTEGER DEFAULT 0,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  raw_payload JSONB NOT NULL, -- Full webhook payload for debugging
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_alchemy_webhook_events_event_id ON alchemy_webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_alchemy_webhook_events_webhook_id ON alchemy_webhook_events(webhook_id);
CREATE INDEX IF NOT EXISTS idx_alchemy_webhook_events_processed_at ON alchemy_webhook_events(processed_at);
CREATE INDEX IF NOT EXISTS idx_alchemy_webhook_events_network ON alchemy_webhook_events(network);

-- Add gas tracking fields to wallet_transactions
ALTER TABLE wallet_transactions ADD COLUMN IF NOT EXISTS gas_fee TEXT;
ALTER TABLE wallet_transactions ADD COLUMN IF NOT EXISTS gas_price_gwei NUMERIC(20,2);
ALTER TABLE wallet_transactions ADD COLUMN IF NOT EXISTS gas_used INTEGER;

-- Add actual payment amount tracking to orders (if not already exists)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS actual_payment_amount NUMERIC(20,8);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_shortage NUMERIC(20,8);

-- Create index on orders payment fields for faster matching
CREATE INDEX IF NOT EXISTS idx_orders_payment_processing ON orders(assigned_wallet_id, payment_status, expected_payment_currency, payment_initiated_at) 
WHERE payment_status = 'payment_processing';

-- RLS policies for alchemy_webhook_events (admin only)
ALTER TABLE alchemy_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access to alchemy_webhook_events" ON alchemy_webhook_events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Add comment to table
COMMENT ON TABLE alchemy_webhook_events IS 'Tracks all Alchemy webhook events for auditing and debugging payment automation';
COMMENT ON COLUMN alchemy_webhook_events.event_id IS 'Unique event ID from Alchemy (e.g., whevt_pz2qu8k04anfjknt)';
COMMENT ON COLUMN alchemy_webhook_events.webhook_id IS 'Webhook ID from Alchemy (e.g., wh_ac5sekedy2t7n2gs)';
COMMENT ON COLUMN alchemy_webhook_events.raw_payload IS 'Complete webhook payload as JSON for debugging';
