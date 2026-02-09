-- ============================================================
-- Supplier Products Migration
-- Gives Johnny his own independent product catalog
-- ============================================================

-- 1. Create supplier_products table (Johnny's own inventory)
CREATE TABLE IF NOT EXISTS supplier_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  supplier_code TEXT NOT NULL,
  description TEXT,
  category TEXT,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  current_stock INTEGER NOT NULL DEFAULT 0,
  restock_level INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  -- Optional link to our products table
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier_id ON supplier_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier_code ON supplier_products(supplier_code);
CREATE INDEX IF NOT EXISTS idx_supplier_products_product_id ON supplier_products(product_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_category ON supplier_products(category);
CREATE INDEX IF NOT EXISTS idx_supplier_products_is_active ON supplier_products(is_active);

-- 3. Unique constraint: supplier_code must be unique per supplier
CREATE UNIQUE INDEX IF NOT EXISTS idx_supplier_products_unique_code
  ON supplier_products(supplier_id, supplier_code);

-- 4. Enable RLS
ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (drop first to make migration re-runnable)
DROP POLICY IF EXISTS "Suppliers can view own products" ON supplier_products;
CREATE POLICY "Suppliers can view own products" ON supplier_products
  FOR SELECT USING (
    supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

DROP POLICY IF EXISTS "Suppliers can create own products" ON supplier_products;
CREATE POLICY "Suppliers can create own products" ON supplier_products
  FOR INSERT WITH CHECK (
    supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

DROP POLICY IF EXISTS "Suppliers can update own products" ON supplier_products;
CREATE POLICY "Suppliers can update own products" ON supplier_products
  FOR UPDATE USING (
    supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

DROP POLICY IF EXISTS "Suppliers can delete own products" ON supplier_products;
CREATE POLICY "Suppliers can delete own products" ON supplier_products
  FOR DELETE USING (
    supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- 6. Add supplier_product_id to supplier_shipment_items
-- This links shipment items to the supplier's own inventory
ALTER TABLE supplier_shipment_items
  ADD COLUMN IF NOT EXISTS supplier_product_id UUID REFERENCES supplier_products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_supplier_shipment_items_supplier_product_id
  ON supplier_shipment_items(supplier_product_id);
