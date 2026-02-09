-- Add missing order_id column to notifications table
-- This column was defined in the original migration but table was created without it

ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE CASCADE;

-- Create the missing index
CREATE INDEX IF NOT EXISTS idx_notifications_order_id ON notifications(order_id);

-- Add comment
COMMENT ON COLUMN notifications.order_id IS 'Reference to related order for order update notifications';
