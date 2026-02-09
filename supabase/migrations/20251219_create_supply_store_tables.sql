-- ============================================
-- SUPPLY STORE TABLES
-- For gymowner, spaowner, wellnessowner roles
-- Completely separate from peptide store
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS supply_store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  product_name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  wholesale_price DECIMAL(10,2) NOT NULL,
  retail_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  source_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '{}'::jsonb,
  -- Business type targeting (gym, medspa, wellness)
  business_types TEXT[] DEFAULT ARRAY['gym', 'medspa', 'wellness'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on category and business_types for filtering
CREATE INDEX IF NOT EXISTS idx_supply_store_products_category ON supply_store_products(category);
CREATE INDEX IF NOT EXISTS idx_supply_store_products_brand ON supply_store_products(brand);
CREATE INDEX IF NOT EXISTS idx_supply_store_products_sku ON supply_store_products(sku);
CREATE INDEX IF NOT EXISTS idx_supply_store_products_business_types ON supply_store_products USING gin(business_types);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS supply_store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Customer details
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_company TEXT,
  customer_phone TEXT,
  
  -- Shipping address
  shipping_address_line1 TEXT,
  shipping_address_line2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_postal_code TEXT,
  shipping_country TEXT DEFAULT 'US',
  
  -- Order totals
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Stripe integration
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  
  -- Shipping
  tracking_number TEXT,
  shipping_carrier TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_supply_store_orders_user_id ON supply_store_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_supply_store_orders_status ON supply_store_orders(status);
CREATE INDEX IF NOT EXISTS idx_supply_store_orders_order_number ON supply_store_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_supply_store_orders_created_at ON supply_store_orders(created_at DESC);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS supply_store_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES supply_store_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES supply_store_products(id) ON DELETE SET NULL,
  
  -- Product snapshot at time of order
  sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  
  -- Pricing
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index for order items
CREATE INDEX IF NOT EXISTS idx_supply_store_order_items_order_id ON supply_store_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_supply_store_order_items_product_id ON supply_store_order_items(product_id);

-- ============================================
-- CART ITEMS TABLE (Server-side cart for logged-in users)
-- ============================================
CREATE TABLE IF NOT EXISTS supply_store_cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES supply_store_products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Unique constraint to prevent duplicate products per user
  UNIQUE(user_id, product_id)
);

-- Index for cart items
CREATE INDEX IF NOT EXISTS idx_supply_store_cart_items_user_id ON supply_store_cart_items(user_id);

-- ============================================
-- CATEGORIES TABLE (for managing categories)
-- ============================================
CREATE TABLE IF NOT EXISTS supply_store_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  -- Which business types can see this category
  business_types TEXT[] DEFAULT ARRAY['gym', 'medspa', 'wellness'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE supply_store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_store_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_store_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_store_categories ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read, only admins can write
CREATE POLICY "supply_store_products_read" ON supply_store_products
  FOR SELECT USING (true);

CREATE POLICY "supply_store_products_admin_write" ON supply_store_products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role IN ('admin', 'superadmin')
    )
  );

-- Categories: Everyone can read, only admins can write
CREATE POLICY "supply_store_categories_read" ON supply_store_categories
  FOR SELECT USING (true);

CREATE POLICY "supply_store_categories_admin_write" ON supply_store_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role IN ('admin', 'superadmin')
    )
  );

-- Orders: Users can read their own, admins can read all
CREATE POLICY "supply_store_orders_user_read" ON supply_store_orders
  FOR SELECT USING (
    user_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "supply_store_orders_user_insert" ON supply_store_orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "supply_store_orders_admin_update" ON supply_store_orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role IN ('admin', 'superadmin')
    )
  );

-- Order Items: Users can read their own order items, admins can read all
CREATE POLICY "supply_store_order_items_read" ON supply_store_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM supply_store_orders 
      WHERE supply_store_orders.id = supply_store_order_items.order_id
      AND (
        supply_store_orders.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM users 
          WHERE users.auth_id = auth.uid() 
          AND users.role IN ('admin', 'superadmin')
        )
      )
    )
  );

-- Cart Items: Users can only manage their own cart
CREATE POLICY "supply_store_cart_items_user_all" ON supply_store_cart_items
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_supply_store_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  -- Get count of orders today for sequential numbering
  SELECT COUNT(*) + 1 INTO counter 
  FROM supply_store_orders 
  WHERE DATE(created_at) = CURRENT_DATE;
  
  -- Format: SS-YYYYMMDD-XXXX (SS = Supply Store)
  new_number := 'SS-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION supply_store_orders_before_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_supply_store_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_supply_store_orders_before_insert
  BEFORE INSERT ON supply_store_orders
  FOR EACH ROW
  EXECUTE FUNCTION supply_store_orders_before_insert();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_supply_store_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER trigger_supply_store_products_updated_at
  BEFORE UPDATE ON supply_store_products
  FOR EACH ROW
  EXECUTE FUNCTION update_supply_store_updated_at();

CREATE TRIGGER trigger_supply_store_orders_updated_at
  BEFORE UPDATE ON supply_store_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_supply_store_updated_at();

CREATE TRIGGER trigger_supply_store_cart_items_updated_at
  BEFORE UPDATE ON supply_store_cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_supply_store_updated_at();

CREATE TRIGGER trigger_supply_store_categories_updated_at
  BEFORE UPDATE ON supply_store_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_supply_store_updated_at();

-- ============================================
-- SEED INITIAL CATEGORIES
-- ============================================
INSERT INTO supply_store_categories (name, slug, description, business_types, display_order) VALUES
  ('Recovery Equipment', 'recovery-equipment', 'Compression therapy, massage guns, and recovery tools', ARRAY['gym', 'medspa', 'wellness'], 1),
  ('Cold Plunge & Heat Therapy', 'cold-plunge-heat-therapy', 'Cold plunges, saunas, and infrared therapy', ARRAY['medspa', 'wellness'], 2),
  ('Cardio Equipment', 'cardio-equipment', 'Bikes, rowers, treadmills, and cardio machines', ARRAY['gym'], 3),
  ('Strength Equipment', 'strength-equipment', 'Dumbbells, kettlebells, and strength training gear', ARRAY['gym'], 4),
  ('Accessories & Consumables', 'accessories-consumables', 'Bands, towels, chalk, and gym accessories', ARRAY['gym', 'wellness'], 5),
  ('Supplements', 'supplements', 'Protein, vitamins, and nutritional supplements', ARRAY['gym', 'medspa', 'wellness'], 6)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE supply_store_products IS 'B2B wholesale products for gym/spa/wellness owners';
COMMENT ON TABLE supply_store_orders IS 'Orders from supply store customers (gymowner, spaowner, wellnessowner)';
COMMENT ON TABLE supply_store_order_items IS 'Individual items within supply store orders';
COMMENT ON TABLE supply_store_cart_items IS 'Server-side cart for logged-in supply store customers';
COMMENT ON TABLE supply_store_categories IS 'Product categories for the supply store';

