-- Add phone verification fields to users table
-- Run this migration to enable SMS-based authentication

-- Add phone_verified column (defaults to false for existing users)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;

-- Add phone_verified_at timestamp
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ;

-- Add preferred_auth_method column (defaults to 'email' for existing users)
-- 'phone' = SMS OTP login, 'email' = email/password login
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS preferred_auth_method VARCHAR(20) DEFAULT 'email';

-- Add prompted_for_phone column to track if user has been asked to add phone
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS prompted_for_phone BOOLEAN DEFAULT FALSE;

-- Create index for phone lookups (for phone-based login)
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE phone IS NOT NULL;

-- Create index for phone_verified lookups
CREATE INDEX IF NOT EXISTS idx_users_phone_verified ON users(phone_verified) WHERE phone_verified = TRUE;

-- Update existing users with verified phones (if any have phone numbers, mark them as needing verification)
-- Existing users with phone numbers will need to verify them
COMMENT ON COLUMN users.phone_verified IS 'Whether the phone number has been verified via SMS OTP';
COMMENT ON COLUMN users.phone_verified_at IS 'Timestamp when phone was verified';
COMMENT ON COLUMN users.preferred_auth_method IS 'User preferred login method: phone (SMS OTP) or email (password)';
COMMENT ON COLUMN users.prompted_for_phone IS 'Whether user has been prompted to add phone number for SMS auth';
