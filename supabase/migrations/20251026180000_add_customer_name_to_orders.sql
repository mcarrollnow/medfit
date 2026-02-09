-- Add customer_name column to orders table for easier searching
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);

-- Create index for faster searching
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);

-- Backfill existing orders with customer names from users table
UPDATE orders o
SET customer_name = CONCAT(u.first_name, ' ', u.last_name)
FROM customers c
JOIN users u ON c.user_id = u.id
WHERE o.customer_id = c.id
AND o.customer_name IS NULL;

-- Add comment
COMMENT ON COLUMN orders.customer_name IS 'Customer full name for easier order searching and display';
