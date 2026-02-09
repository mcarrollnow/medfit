-- Add shipping tracking columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipping_carrier TEXT,
ADD COLUMN IF NOT EXISTS ship_date DATE,
ADD COLUMN IF NOT EXISTS estimated_delivery DATE;

-- Create index for tracking number lookups
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);

-- Add comment
COMMENT ON COLUMN orders.tracking_number IS 'Shipping tracking number from carrier (UPS, USPS, FedEx)';
COMMENT ON COLUMN orders.shipping_carrier IS 'Shipping carrier: UPS, USPS, FedEx, etc.';
COMMENT ON COLUMN orders.ship_date IS 'Date package was shipped';
COMMENT ON COLUMN orders.estimated_delivery IS 'Estimated delivery date from carrier';
