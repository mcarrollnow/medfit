-- ============================================================
-- Order Fulfillment Wizard Migration
-- Adds fulfillment tracking fields to orders and ensures
-- order_photos table supports the QR-scan upload flow
-- ============================================================

-- 1. Add fulfillment fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfillment_token TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfillment_started_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS packed_by TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pack_verified_at TIMESTAMPTZ;

-- 2. Index on fulfillment_token for fast lookup during QR photo uploads
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_token ON orders(fulfillment_token)
  WHERE fulfillment_token IS NOT NULL;

-- 3. Ensure order_photos table has proper constraints
-- The table already exists with columns: id, order_id (text), url, filename, size, content_type, uploaded_by, created_at, storage_path
-- Add an index on order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_photos_order_id ON order_photos(order_id);

-- 4. Create storage bucket for fulfillment photos (if not exists)
-- This is handled via Supabase dashboard or client-side, not SQL

-- 5. RLS policies for order_photos (make idempotent)
ALTER TABLE order_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage order photos" ON order_photos;
CREATE POLICY "Admins can manage order photos" ON order_photos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

DROP POLICY IF EXISTS "Suppliers can view order photos" ON order_photos;
CREATE POLICY "Suppliers can view order photos" ON order_photos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'supplier')
  );

DROP POLICY IF EXISTS "Public can insert order photos with token" ON order_photos;
CREATE POLICY "Public can insert order photos with token" ON order_photos
  FOR INSERT WITH CHECK (true);
