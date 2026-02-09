-- Add delivered_at timestamp to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;

-- Add comment
COMMENT ON COLUMN orders.delivered_at IS 'Timestamp when order was marked as delivered';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_delivered_at ON orders(delivered_at);
