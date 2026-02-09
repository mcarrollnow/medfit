-- ============================================================
-- Supplier Portal Migration
-- Adds supplier customer support, order tagging, and shipment builder
-- ============================================================

-- 1. Add supplier_id to customers table (links customer to their supplier)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_customers_supplier_id ON customers(supplier_id);

-- 1b. Add supplier_id to authorize_net_invoices table (for supplier invoice onboarding)
ALTER TABLE authorize_net_invoices ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- 2. Add source and supplier_id to orders table (tags supplier pipeline orders)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'direct';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_orders_source ON orders(source);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON orders(supplier_id);

-- 3. Create supplier_shipments table (Johnny's box builder)
CREATE TABLE IF NOT EXISTS supplier_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shipment_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'building' CHECK (status IN ('building', 'sealed', 'shipped', 'received')),
  tracking_number TEXT,
  carrier TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  shipped_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_supplier_shipments_supplier_id ON supplier_shipments(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_shipments_status ON supplier_shipments(status);

-- 4. Create supplier_shipment_items table
CREATE TABLE IF NOT EXISTS supplier_shipment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES supplier_shipments(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  supplier_code TEXT,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_supplier_shipment_items_shipment_id ON supplier_shipment_items(shipment_id);

-- 5. Create supplier_shipment_photos table
CREATE TABLE IF NOT EXISTS supplier_shipment_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES supplier_shipments(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_supplier_shipment_photos_shipment_id ON supplier_shipment_photos(shipment_id);

-- 6. Enable RLS on new tables
ALTER TABLE supplier_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_shipment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_shipment_photos ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for supplier_shipments
-- Suppliers can manage their own shipments
CREATE POLICY "Suppliers can view own shipments" ON supplier_shipments
  FOR SELECT USING (
    supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

CREATE POLICY "Suppliers can create own shipments" ON supplier_shipments
  FOR INSERT WITH CHECK (
    supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Suppliers can update own shipments" ON supplier_shipments
  FOR UPDATE USING (
    supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

CREATE POLICY "Admins can delete shipments" ON supplier_shipments
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- 8. RLS Policies for supplier_shipment_items
CREATE POLICY "Users can view shipment items" ON supplier_shipment_items
  FOR SELECT USING (
    shipment_id IN (
      SELECT id FROM supplier_shipments WHERE supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

CREATE POLICY "Suppliers can manage shipment items" ON supplier_shipment_items
  FOR INSERT WITH CHECK (
    shipment_id IN (
      SELECT id FROM supplier_shipments WHERE supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Suppliers can update shipment items" ON supplier_shipment_items
  FOR UPDATE USING (
    shipment_id IN (
      SELECT id FROM supplier_shipments WHERE supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Suppliers can delete shipment items" ON supplier_shipment_items
  FOR DELETE USING (
    shipment_id IN (
      SELECT id FROM supplier_shipments WHERE supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- 9. RLS Policies for supplier_shipment_photos
CREATE POLICY "Users can view shipment photos" ON supplier_shipment_photos
  FOR SELECT USING (
    shipment_id IN (
      SELECT id FROM supplier_shipments WHERE supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

CREATE POLICY "Suppliers can manage shipment photos" ON supplier_shipment_photos
  FOR INSERT WITH CHECK (
    shipment_id IN (
      SELECT id FROM supplier_shipments WHERE supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Suppliers can delete shipment photos" ON supplier_shipment_photos
  FOR DELETE USING (
    shipment_id IN (
      SELECT id FROM supplier_shipments WHERE supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- 10. Create storage bucket for supplier shipment photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('supplier-shipment-photos', 'supplier-shipment-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: suppliers can upload to their own folder
CREATE POLICY "Suppliers can upload shipment photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'supplier-shipment-photos'
    AND EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('supplier', 'superadmin', 'admin'))
  );

CREATE POLICY "Anyone can view shipment photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'supplier-shipment-photos');

CREATE POLICY "Suppliers can delete own shipment photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'supplier-shipment-photos'
    AND EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('supplier', 'superadmin', 'admin'))
  );
