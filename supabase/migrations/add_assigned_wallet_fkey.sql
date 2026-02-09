-- Add foreign key constraint for assigned_wallet_id
-- The column exists but the constraint is missing

-- STEP 1: Clean up orphaned wallet references
-- Set assigned_wallet_id to NULL where the wallet doesn't exist
UPDATE orders
SET assigned_wallet_id = NULL
WHERE assigned_wallet_id IS NOT NULL
  AND assigned_wallet_id NOT IN (SELECT id FROM business_wallets);

-- STEP 2: Add the foreign key constraint
ALTER TABLE orders
ADD CONSTRAINT orders_assigned_wallet_id_fkey 
FOREIGN KEY (assigned_wallet_id) 
REFERENCES business_wallets(id) 
ON DELETE SET NULL;

-- Verify the constraint was created
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_name = 'orders_assigned_wallet_id_fkey';
