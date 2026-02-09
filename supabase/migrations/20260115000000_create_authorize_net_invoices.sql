-- Create Authorize.net invoices table
-- Stores invoices created through the Authorize.net invoice generator

CREATE TABLE IF NOT EXISTS authorize_net_invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  manual_adjustment DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'void', 'overdue')),
  due_date DATE,
  notes TEXT,
  payment_url TEXT,
  payment_token TEXT,
  transaction_id TEXT,
  paid_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_anet_invoices_status ON authorize_net_invoices(status);
CREATE INDEX IF NOT EXISTS idx_anet_invoices_customer_email ON authorize_net_invoices(customer_email);
CREATE INDEX IF NOT EXISTS idx_anet_invoices_created_at ON authorize_net_invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_anet_invoices_due_date ON authorize_net_invoices(due_date);

-- RLS policies
ALTER TABLE authorize_net_invoices ENABLE ROW LEVEL SECURITY;

-- Admins can manage all invoices
DROP POLICY IF EXISTS "Admins can manage authorize_net_invoices" ON authorize_net_invoices;
CREATE POLICY "Admins can manage authorize_net_invoices" ON authorize_net_invoices
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = (SELECT auth.uid()) 
    AND users.role = 'admin'
  ));

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_authorize_net_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_authorize_net_invoices_updated_at ON authorize_net_invoices;
CREATE TRIGGER trigger_update_authorize_net_invoices_updated_at
  BEFORE UPDATE ON authorize_net_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_authorize_net_invoices_updated_at();

COMMENT ON TABLE authorize_net_invoices IS 'Invoices created through Authorize.net invoice generator';
COMMENT ON COLUMN authorize_net_invoices.items IS 'JSON array of invoice line items with description, quantity, unit_price';
COMMENT ON COLUMN authorize_net_invoices.payment_url IS 'Authorize.net Accept Hosted payment page URL';
COMMENT ON COLUMN authorize_net_invoices.payment_token IS 'Authorize.net hosted payment page token';
COMMENT ON COLUMN authorize_net_invoices.transaction_id IS 'Authorize.net transaction ID after payment';
