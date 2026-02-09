-- Add order_id column to authorize_net_invoices table
-- This links invoices to orders so we can track order details

ALTER TABLE authorize_net_invoices 
ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_anet_invoices_order_id ON authorize_net_invoices(order_id);

COMMENT ON COLUMN authorize_net_invoices.order_id IS 'Reference to the order created from this invoice';
