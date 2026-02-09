-- Add additional invoice statuses: cancelled and archived
-- Drop the existing constraint and recreate with new values

ALTER TABLE authorize_net_invoices 
DROP CONSTRAINT IF EXISTS authorize_net_invoices_status_check;

ALTER TABLE authorize_net_invoices 
ADD CONSTRAINT authorize_net_invoices_status_check 
CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'void', 'overdue', 'cancelled', 'archived'));

COMMENT ON COLUMN authorize_net_invoices.status IS 'Invoice status: draft, sent, viewed, paid, void, overdue, cancelled, archived';
