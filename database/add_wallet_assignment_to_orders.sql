-- Add wallet assignment to orders table
-- This allows admins to assign a specific wallet to an order for payment

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS assigned_wallet_id UUID REFERENCES business_wallets(id);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_assigned_wallet ON orders(assigned_wallet_id);
