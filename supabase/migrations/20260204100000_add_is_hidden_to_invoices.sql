-- Add is_hidden column to authorize_net_invoices table
-- Hidden invoices don't show in active listings and don't create orders
-- Only superadmins can create hidden invoices

ALTER TABLE authorize_net_invoices
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

-- Add index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_authorize_net_invoices_is_hidden 
ON authorize_net_invoices(is_hidden);

-- Add comment for documentation
COMMENT ON COLUMN authorize_net_invoices.is_hidden IS 'Hidden invoices do not appear in active listings and do not create orders. Only superadmins can create them.';
