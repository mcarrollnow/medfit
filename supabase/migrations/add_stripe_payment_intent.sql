-- Add stripe_payment_intent_id column to orders table for card payments
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Create index for faster lookups by payment intent ID
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent ON orders(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;

