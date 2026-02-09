-- Payments System Schema
-- Tracks payments received, wire transfers to Johnny, and messages

-- Payment Contacts (customers who have sent payments)
CREATE TABLE IF NOT EXISTS payment_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL, -- lowercase, trimmed for matching
  total_paid DECIMAL(12,2) DEFAULT 0,
  payment_count INTEGER DEFAULT 0,
  first_payment_date DATE,
  last_payment_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_contacts_normalized ON payment_contacts(normalized_name);
CREATE INDEX IF NOT EXISTS idx_payment_contacts_name ON payment_contacts(name);

-- Payments received from customers
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES payment_contacts(id) ON DELETE SET NULL,
  contact_name TEXT NOT NULL, -- Store name directly for sheet sync
  payment_date DATE NOT NULL,
  payment_method TEXT, -- Zelle, Venmo, Cashapp, PayPal, etc.
  amount DECIMAL(12,2) NOT NULL,
  received_minus_fee DECIMAL(12,2), -- Amount after payment processor fees
  confirmed BOOLEAN DEFAULT false,
  notes TEXT,
  sheet_row_number INTEGER, -- For syncing back to Google Sheets
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_contact ON payments(contact_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_contact_name ON payments(contact_name);

-- Wire Transfers sent to Johnny
CREATE TABLE IF NOT EXISTS wire_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(12,2) NOT NULL,
  transfer_date DATE NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, completed, rejected, cancelled
  total_left_to_transfer DECIMAL(12,2), -- Running balance
  bank_reference TEXT,
  notes TEXT,
  sheet_row_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wire_transfers_date ON wire_transfers(transfer_date);
CREATE INDEX IF NOT EXISTS idx_wire_transfers_status ON wire_transfers(status);

-- Messages between Johnny and Admin (Michael)
CREATE TABLE IF NOT EXISTS payment_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender TEXT NOT NULL, -- 'johnny' or 'admin'
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_messages_sender ON payment_messages(sender);
CREATE INDEX IF NOT EXISTS idx_payment_messages_created ON payment_messages(created_at DESC);

-- Tariff/Cost records (from the Cost of Tariff column)
CREATE TABLE IF NOT EXISTS tariff_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  tracking_numbers TEXT[], -- Array of tracking numbers
  tariff_cost DECIMAL(12,2),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payment_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wire_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariff_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow authenticated users and service role)
CREATE POLICY "payment_contacts_auth" ON payment_contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "payment_contacts_service" ON payment_contacts FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "payments_auth" ON payments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "payments_service" ON payments FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "wire_transfers_auth" ON wire_transfers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "wire_transfers_service" ON wire_transfers FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "payment_messages_auth" ON payment_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "payment_messages_service" ON payment_messages FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "tariff_records_auth" ON tariff_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "tariff_records_service" ON tariff_records FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Trigger to update contact totals when payment is added/updated/deleted
CREATE OR REPLACE FUNCTION update_contact_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the contact's totals
  IF TG_OP = 'DELETE' THEN
    UPDATE payment_contacts SET
      total_paid = COALESCE((SELECT SUM(amount) FROM payments WHERE contact_id = OLD.contact_id), 0),
      payment_count = COALESCE((SELECT COUNT(*) FROM payments WHERE contact_id = OLD.contact_id), 0),
      first_payment_date = (SELECT MIN(payment_date) FROM payments WHERE contact_id = OLD.contact_id),
      last_payment_date = (SELECT MAX(payment_date) FROM payments WHERE contact_id = OLD.contact_id),
      updated_at = NOW()
    WHERE id = OLD.contact_id;
    RETURN OLD;
  ELSE
    UPDATE payment_contacts SET
      total_paid = COALESCE((SELECT SUM(amount) FROM payments WHERE contact_id = NEW.contact_id), 0),
      payment_count = COALESCE((SELECT COUNT(*) FROM payments WHERE contact_id = NEW.contact_id), 0),
      first_payment_date = (SELECT MIN(payment_date) FROM payments WHERE contact_id = NEW.contact_id),
      last_payment_date = (SELECT MAX(payment_date) FROM payments WHERE contact_id = NEW.contact_id),
      updated_at = NOW()
    WHERE id = NEW.contact_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payments_update_contact_totals
AFTER INSERT OR UPDATE OR DELETE ON payments
FOR EACH ROW EXECUTE FUNCTION update_contact_totals();

