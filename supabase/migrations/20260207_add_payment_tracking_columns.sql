-- Add additional tracking columns to payments table
-- These columns capture data from the Google Sheet that wasn't previously tracked

-- Add tracking numbers and tariff info to payments
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS tracking_numbers TEXT[], -- Array of tracking numbers from "Cost of Tariff" column
ADD COLUMN IF NOT EXISTS tariff_cost DECIMAL(12,2), -- Tariff cost value
ADD COLUMN IF NOT EXISTS confirmation_status TEXT DEFAULT 'confirmed', -- Y, pending, refunded, zeroed, disputed
ADD COLUMN IF NOT EXISTS wire_transfer_notes TEXT; -- Notes about wire transfer association (cagri, venmo correction, etc.)

-- Add transaction numbers and tariff tracking to wire_transfers
ALTER TABLE wire_transfers
ADD COLUMN IF NOT EXISTS transaction_numbers TEXT[], -- Array of transaction/tracking numbers
ADD COLUMN IF NOT EXISTS tariff_cost DECIMAL(12,2), -- Associated tariff costs
ADD COLUMN IF NOT EXISTS tariff_notes TEXT; -- Notes about tariffs

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_payments_confirmation_status ON payments(confirmation_status);
CREATE INDEX IF NOT EXISTS idx_payments_tracking ON payments USING GIN(tracking_numbers);

-- Add comment for documentation
COMMENT ON COLUMN payments.tracking_numbers IS 'Array of tracking numbers associated with this payment (from Cost of Tariff column)';
COMMENT ON COLUMN payments.tariff_cost IS 'Tariff/customs cost associated with this payment';
COMMENT ON COLUMN payments.confirmation_status IS 'Status: confirmed, pending, refunded, zeroed, disputed';
COMMENT ON COLUMN payments.wire_transfer_notes IS 'Notes about wire transfer association or payment corrections';
COMMENT ON COLUMN wire_transfers.transaction_numbers IS 'Array of transaction/tracking numbers associated with wire transfer';
COMMENT ON COLUMN wire_transfers.tariff_cost IS 'Total tariff costs covered by this wire transfer';
COMMENT ON COLUMN wire_transfers.tariff_notes IS 'Notes about tariffs included in this transfer';
