-- Create discount_codes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  customer_type VARCHAR(20) DEFAULT 'all' CHECK (customer_type IN ('all', 'retail', 'b2b', 'retailvip', 'b2bvip')),
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  min_order_amount DECIMAL(10,2),
  free_shipping BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(UPPER(code));

-- Enable Row Level Security
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admin full access to discount_codes" ON discount_codes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Regular users can't access discount codes directly (they use the API)
CREATE POLICY "Discount codes are private" ON discount_codes
  FOR SELECT
  TO authenticated
  USING (false);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_discount_codes_updated_at
  BEFORE UPDATE ON discount_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample discount codes (optional)
INSERT INTO public.discount_codes (code, description, discount_type, discount_value, customer_type, is_active)
VALUES 
  ('WELCOME10', 'Welcome discount - 10% off', 'percentage', 10, 'all', true),
  ('SAVE20', 'Save $20 on your order', 'fixed', 20, 'all', true),
  ('B2BSPECIAL', 'B2B Customer Special - 15% off', 'percentage', 15, 'b2b', true)
ON CONFLICT (code) DO NOTHING;
