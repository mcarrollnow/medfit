-- Add manual_adjustment column to authorize_net_invoices if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'authorize_net_invoices' 
    AND column_name = 'manual_adjustment'
  ) THEN
    ALTER TABLE authorize_net_invoices 
    ADD COLUMN manual_adjustment DECIMAL(10,2) NOT NULL DEFAULT 0;
  END IF;
END $$;
