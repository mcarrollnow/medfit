-- Add rep discount code creation permission to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS can_create_discount_codes BOOLEAN DEFAULT false;

-- Add rep fields to discount_codes table
ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS created_by_rep_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS assigned_rep_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create index for faster rep discount code lookups
CREATE INDEX IF NOT EXISTS idx_discount_codes_created_by_rep ON discount_codes(created_by_rep_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_assigned_rep ON discount_codes(assigned_rep_id);

-- Comment on columns
COMMENT ON COLUMN users.can_create_discount_codes IS 'Whether this rep can create their own discount codes';
COMMENT ON COLUMN discount_codes.created_by_rep_id IS 'The rep who created this discount code (null if created by admin)';
COMMENT ON COLUMN discount_codes.assigned_rep_id IS 'The rep this discount code is assigned to (for visibility/tracking)';

