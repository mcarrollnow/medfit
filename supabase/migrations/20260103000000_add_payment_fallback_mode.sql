-- Add payment fallback mode settings to site_settings
-- This allows orders to be created without payment, sending invoices via Shopify instead

-- Add payment fallback columns to site_settings
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS payment_fallback_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_fallback_message TEXT DEFAULT 'Payment processing is temporarily unavailable. An invoice will be sent to your email.',
  ADD COLUMN IF NOT EXISTS shopify_store_domain TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS shopify_client_id TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS shopify_access_token TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS shopify_invoice_prefix TEXT DEFAULT 'INV';

-- Add shopify_invoice_id to orders table for tracking
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS shopify_invoice_id TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS shopify_invoice_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS invoice_sent_at TIMESTAMPTZ DEFAULT NULL;

COMMENT ON COLUMN site_settings.payment_fallback_enabled IS 'When true, checkout skips payment and sends Shopify invoice instead';
COMMENT ON COLUMN site_settings.payment_fallback_message IS 'Message shown to customers during fallback checkout';
COMMENT ON COLUMN site_settings.shopify_store_domain IS 'Shopify store domain (e.g., your-store.myshopify.com)';
COMMENT ON COLUMN site_settings.shopify_access_token IS 'Shopify Admin API access token (encrypted at rest)';
COMMENT ON COLUMN site_settings.shopify_invoice_prefix IS 'Prefix for invoice numbers sent to customers';

COMMENT ON COLUMN orders.shopify_invoice_id IS 'Draft order ID from Shopify for invoice tracking';
COMMENT ON COLUMN orders.shopify_invoice_url IS 'Invoice URL for customer to pay';
COMMENT ON COLUMN orders.invoice_sent_at IS 'Timestamp when invoice was sent to customer';

