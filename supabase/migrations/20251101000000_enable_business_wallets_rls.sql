-- Enable RLS on business_wallets table
-- Created: 2025-11-01
-- Purpose: Enable Row Level Security with proper access policies
-- Wallet addresses are public on blockchain anyway, no security risk in read access

-- Enable RLS
ALTER TABLE business_wallets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins can view all wallets" ON business_wallets;
DROP POLICY IF EXISTS "Admins can insert wallets" ON business_wallets;
DROP POLICY IF EXISTS "Admins can update wallets" ON business_wallets;
DROP POLICY IF EXISTS "Admins can delete wallets" ON business_wallets;
DROP POLICY IF EXISTS "Admin full access to business_wallets" ON business_wallets;
DROP POLICY IF EXISTS "Authenticated users can view active wallets" ON business_wallets;

-- Authenticated users can view active wallets (read-only for checkout)
CREATE POLICY "Authenticated users can view active wallets"
  ON business_wallets FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admin full access to business_wallets"
  ON business_wallets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- Add comment explaining the security model
COMMENT ON TABLE business_wallets IS 
  'Business crypto wallet addresses. RLS enabled. ' ||
  'Authenticated users can view active wallets (needed for checkout). ' ||
  'Wallet addresses are public on blockchain anyway. ' ||
  'Only admins can insert/update/delete.';
