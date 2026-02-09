-- Add columns for Shopify webhook support
-- This enables tracking when invoices are paid

-- Add webhook secret for verifying Shopify webhooks
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS shopify_webhook_secret TEXT DEFAULT '';

-- Add paid_at timestamp to orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ DEFAULT NULL;

