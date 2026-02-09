-- Incoming shipments/packages tracking
CREATE TABLE IF NOT EXISTS incoming_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipped_date DATE,
  tracking_number TEXT,
  carrier TEXT, -- DHL, USPS, UPS, etc.
  status TEXT DEFAULT 'in_transit' CHECK (status IN ('in_transit', 'delivered', 'stopped', 'lost', 'seized', 'returned')),
  notes TEXT,
  counted_in_inventory BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Line items for each shipment (products being shipped)
CREATE TABLE IF NOT EXISTS shipment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES incoming_shipments(id) ON DELETE CASCADE,
  product_code TEXT, -- The code from your spreadsheet (e.g., "482802", "758308")
  product_id UUID REFERENCES products(id) ON DELETE SET NULL, -- Link to actual product if matched
  quantity INTEGER NOT NULL DEFAULT 0,
  description TEXT, -- Product description
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_shipments_status ON incoming_shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON incoming_shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipment_items_code ON shipment_items(product_code);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_shipment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shipments_updated_at
  BEFORE UPDATE ON incoming_shipments
  FOR EACH ROW
  EXECUTE FUNCTION update_shipment_timestamp();

-- RLS policies
ALTER TABLE incoming_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_items ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated read shipments" ON incoming_shipments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read shipment_items" ON shipment_items
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to manage (admin checks done at application level via service role)
CREATE POLICY "Allow authenticated manage shipments" ON incoming_shipments
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated manage shipment_items" ON shipment_items
  FOR ALL TO authenticated USING (true);

-- Allow service role full access (for server actions)
CREATE POLICY "Allow service role shipments" ON incoming_shipments
  FOR ALL TO service_role USING (true);

CREATE POLICY "Allow service role shipment_items" ON shipment_items
  FOR ALL TO service_role USING (true);

