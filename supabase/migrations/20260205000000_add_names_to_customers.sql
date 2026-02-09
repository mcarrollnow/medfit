-- Add first_name and last_name columns to customers table
-- This makes it much easier to identify customers without needing to join with users table

-- Add the columns if they don't already exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'first_name') THEN
    ALTER TABLE customers ADD COLUMN first_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'last_name') THEN
    ALTER TABLE customers ADD COLUMN last_name TEXT;
  END IF;
END $$;

-- Create indexes for faster name-based searching
CREATE INDEX IF NOT EXISTS idx_customers_first_name ON customers(first_name);
CREATE INDEX IF NOT EXISTS idx_customers_last_name ON customers(last_name);

-- Backfill existing customers with names from the users table
UPDATE customers c
SET 
  first_name = u.first_name,
  last_name = u.last_name
FROM users u
WHERE c.user_id = u.id
AND (c.first_name IS NULL OR c.last_name IS NULL);
