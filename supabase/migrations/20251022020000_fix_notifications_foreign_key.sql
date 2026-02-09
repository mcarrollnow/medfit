-- Fix notifications foreign key constraint issue
-- The user_id should not have a foreign key constraint since it references auth.users
-- which causes issues with the dual user table architecture

-- Drop the problematic foreign key constraint
ALTER TABLE notifications 
DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- The notifications table will still work fine without this constraint
-- The user_id column will store auth.users.id values directly
-- RLS policies will still enforce security

COMMENT ON COLUMN notifications.user_id IS 'User ID from auth.users (no foreign key constraint due to cross-schema reference)';
