-- Add transaction numbers and tariff cost columns to wire_transfers
ALTER TABLE wire_transfers 
ADD COLUMN IF NOT EXISTS transaction_numbers text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tariff_cost decimal(12,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS tariff_notes text DEFAULT NULL;

-- Add index for looking up by transaction number
CREATE INDEX IF NOT EXISTS idx_wire_transfers_transaction_numbers 
ON wire_transfers USING GIN (transaction_numbers);

