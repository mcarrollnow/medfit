-- Enforce that all wallets must have encrypted private keys
-- This prevents creation of view-only wallets

-- Add NOT NULL constraints to encryption fields
ALTER TABLE business_wallets 
  ALTER COLUMN encrypted_private_key SET NOT NULL,
  ALTER COLUMN private_key_iv SET NOT NULL,
  ALTER COLUMN private_key_auth_tag SET NOT NULL;

-- Add check constraint to ensure encryption fields are not empty strings
ALTER TABLE business_wallets
  ADD CONSTRAINT check_encryption_fields_not_empty 
  CHECK (
    length(encrypted_private_key) > 0 AND
    length(private_key_iv) > 0 AND
    length(private_key_auth_tag) > 0
  );

-- Add comment
COMMENT ON CONSTRAINT check_encryption_fields_not_empty ON business_wallets IS 
  'Ensures all wallets have valid encryption fields. View-only wallets are not supported.';

-- Note: If you have existing wallets without encryption fields, 
-- you must delete them before running this migration:
-- DELETE FROM business_wallets WHERE encrypted_private_key IS NULL;
