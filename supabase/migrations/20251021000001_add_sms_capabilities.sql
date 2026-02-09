-- Add phone number and SMS preferences to customers table
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS sms_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sms_opted_in_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS sms_opted_out_at TIMESTAMP WITH TIME ZONE;

-- Add index for phone number lookups
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Add comment explaining SMS opt-in
COMMENT ON COLUMN customers.phone IS 'Customer phone number in E.164 format (e.g., +12025551234)';
COMMENT ON COLUMN customers.sms_enabled IS 'Whether customer has opted in to receive SMS notifications';
COMMENT ON COLUMN customers.sms_opted_in_at IS 'Timestamp when customer opted in to SMS';
COMMENT ON COLUMN customers.sms_opted_out_at IS 'Timestamp when customer opted out of SMS (most recent)';

-- Create SMS log table for tracking sent messages
CREATE TABLE IF NOT EXISTS sms_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  to_phone VARCHAR(20) NOT NULL,
  from_phone VARCHAR(20) NOT NULL,
  message_body TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'transactional', -- transactional, support, notification
  telnyx_message_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'queued', -- queued, sent, delivered, failed, undelivered
  error_message TEXT,
  cost_cents INTEGER, -- cost in cents
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE SET NULL,
  sent_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- who triggered the SMS (admin, AI, system)
  sent_by_ai BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes for SMS logs
CREATE INDEX IF NOT EXISTS idx_sms_logs_customer_id ON sms_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_created_at ON sms_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_sms_logs_status ON sms_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_logs_telnyx_message_id ON sms_logs(telnyx_message_id);

-- Add RLS policies for SMS logs (admin only)
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all SMS logs"
  ON sms_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "System can insert SMS logs"
  ON sms_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE sms_logs IS 'Log of all SMS messages sent through Telnyx for compliance and tracking';
