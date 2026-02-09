-- Create notifications table for support ticket updates
-- This allows customers to receive in-app notifications when agents respond

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Notification content
  type TEXT NOT NULL DEFAULT 'support_ticket',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Reference to related entities
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  ticket_message_id UUID,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Notification state
  read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT notifications_type_check CHECK (type IN ('support_ticket', 'order_update', 'system'))
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_customer_id ON notifications(customer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_ticket_id ON notifications(ticket_id);
CREATE INDEX IF NOT EXISTS idx_notifications_order_id ON notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for admins
DROP POLICY IF EXISTS "Admins can view all notifications" ON notifications;
CREATE POLICY "Admins can view all notifications"
  ON notifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Service role can insert notifications" ON notifications;
CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Function to create notification when admin/agent responds to ticket
CREATE OR REPLACE FUNCTION create_ticket_response_notification()
RETURNS TRIGGER AS $$
DECLARE
  v_ticket support_tickets%ROWTYPE;
  v_customer customers%ROWTYPE;
BEGIN
  -- Only create notification for admin/agent messages (not customer messages)
  IF NEW.is_admin = true OR NEW.is_ai = true THEN
    -- Get ticket details
    SELECT * INTO v_ticket
    FROM support_tickets
    WHERE id = NEW.ticket_id;
    
    IF FOUND THEN
      -- Get customer details
      SELECT * INTO v_customer
      FROM customers
      WHERE id = v_ticket.customer_id;
      
      IF FOUND THEN
        -- Create notification for the customer
        INSERT INTO notifications (
          user_id,
          customer_id,
          type,
          title,
          message,
          ticket_id,
          ticket_message_id,
          read,
          created_at
        ) VALUES (
          v_ticket.user_id,
          v_customer.id,
          'support_ticket',
          'Support Team - ' || v_ticket.subject,
          LEFT(NEW.message, 200), -- Preview of message (first 200 chars)
          v_ticket.id,
          NEW.id,
          false,
          NOW()
        );
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create notifications
DROP TRIGGER IF EXISTS trigger_create_ticket_response_notification ON ticket_messages;
CREATE TRIGGER trigger_create_ticket_response_notification
  AFTER INSERT ON ticket_messages
  FOR EACH ROW
  EXECUTE FUNCTION create_ticket_response_notification();

-- Comments
COMMENT ON TABLE notifications IS 'User notifications for support tickets and system events';
COMMENT ON COLUMN notifications.type IS 'Type of notification: support_ticket, order_update, or system';
COMMENT ON COLUMN notifications.title IS 'Notification title displayed to user';
COMMENT ON COLUMN notifications.message IS 'Preview or full notification message';
COMMENT ON COLUMN notifications.ticket_id IS 'Reference to related support ticket';
COMMENT ON COLUMN notifications.ticket_message_id IS 'Reference to specific ticket message that triggered notification';
COMMENT ON COLUMN notifications.order_id IS 'Reference to related order';
COMMENT ON COLUMN notifications.read IS 'Whether user has read this notification';
COMMENT ON COLUMN notifications.read_at IS 'When user marked notification as read';
