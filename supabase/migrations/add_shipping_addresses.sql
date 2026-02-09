-- Create shipping addresses table for multiple addresses per customer
CREATE TABLE IF NOT EXISTS shipping_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  label VARCHAR(100), -- e.g., "Home", "Office", "Mom's House"
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'United States',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster customer lookups
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_customer ON shipping_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_default ON shipping_addresses(customer_id, is_default);

-- Add RLS policies
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;

-- Users can only see their own addresses
CREATE POLICY "Users can view own shipping addresses"
  ON shipping_addresses FOR SELECT
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

-- Users can insert their own addresses
CREATE POLICY "Users can insert own shipping addresses"
  ON shipping_addresses FOR INSERT
  WITH CHECK (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

-- Users can update their own addresses
CREATE POLICY "Users can update own shipping addresses"
  ON shipping_addresses FOR UPDATE
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

-- Users can delete their own addresses
CREATE POLICY "Users can delete own shipping addresses"
  ON shipping_addresses FOR DELETE
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

-- Admins can view all addresses
CREATE POLICY "Admins can view all shipping addresses"
  ON shipping_addresses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_shipping_address_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_shipping_addresses_updated_at
  BEFORE UPDATE ON shipping_addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_shipping_address_updated_at();

-- Function to ensure only one default address per customer
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE shipping_addresses 
    SET is_default = FALSE 
    WHERE customer_id = NEW.customer_id 
    AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain single default address
CREATE TRIGGER ensure_default_address_unique
  BEFORE INSERT OR UPDATE ON shipping_addresses
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_address();

COMMENT ON TABLE shipping_addresses IS 'Stores multiple shipping addresses per customer';
COMMENT ON COLUMN shipping_addresses.label IS 'User-friendly label for the address (e.g., Home, Office)';
COMMENT ON COLUMN shipping_addresses.is_default IS 'Whether this is the default shipping address for this customer';
