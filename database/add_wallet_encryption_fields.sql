-- Add encrypted wallet storage fields to business_wallets table
-- This allows secure storage of private keys for backend transaction signing

ALTER TABLE business_wallets 
ADD COLUMN IF NOT EXISTS encrypted_private_key TEXT,
ADD COLUMN IF NOT EXISTS private_key_iv TEXT,
ADD COLUMN IF NOT EXISTS private_key_auth_tag TEXT,
ADD COLUMN IF NOT EXISTS encrypted_mnemonic TEXT,
ADD COLUMN IF NOT EXISTS mnemonic_iv TEXT,
ADD COLUMN IF NOT EXISTS mnemonic_auth_tag TEXT,
ADD COLUMN IF NOT EXISTS pin_hash TEXT,
ADD COLUMN IF NOT EXISTS webauthn_credential_id TEXT,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Add columns for gas fee tracking in wallet_transactions
ALTER TABLE wallet_transactions
ADD COLUMN IF NOT EXISTS gas_fee NUMERIC(20, 10),
ADD COLUMN IF NOT EXISTS gas_price_gwei NUMERIC(20, 2),
ADD COLUMN IF NOT EXISTS gas_used INTEGER;

-- Add columns for payment amount tracking in orders
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS actual_payment_amount NUMERIC(20, 10),
ADD COLUMN IF NOT EXISTS payment_shortage NUMERIC(20, 10);

COMMENT ON COLUMN business_wallets.encrypted_private_key IS 'AES-256-GCM encrypted private key';
COMMENT ON COLUMN business_wallets.pin_hash IS 'bcrypt hash of PIN for wallet access';
COMMENT ON COLUMN business_wallets.webauthn_credential_id IS 'WebAuthn credential ID for biometric access';
COMMENT ON COLUMN business_wallets.created_by IS 'Admin user who created this wallet';

COMMENT ON COLUMN wallet_transactions.gas_fee IS 'Gas fee paid in ETH for this transaction';
COMMENT ON COLUMN wallet_transactions.gas_price_gwei IS 'Gas price in Gwei at time of transaction';
COMMENT ON COLUMN wallet_transactions.gas_used IS 'Gas units consumed by transaction';

COMMENT ON COLUMN orders.actual_payment_amount IS 'Actual crypto amount sent by customer (tx.value)';
COMMENT ON COLUMN orders.payment_shortage IS 'Amount short if customer underpaid';
