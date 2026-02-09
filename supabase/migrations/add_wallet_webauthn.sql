-- Add WebAuthn credential reference to business_wallets table
ALTER TABLE business_wallets
ADD COLUMN webauthn_credential_id UUID REFERENCES webauthn_credentials(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_business_wallets_webauthn ON business_wallets(webauthn_credential_id) WHERE webauthn_credential_id IS NOT NULL;

-- Add comment
COMMENT ON COLUMN business_wallets.webauthn_credential_id IS 'WebAuthn credential ID for hardware key protection (Yubikey, etc)';
