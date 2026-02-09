-- Simple SMS conversations table for testing two-way SMS
CREATE TABLE IF NOT EXISTS sms_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT NOT NULL,
  message_text TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  received_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups by phone
CREATE INDEX idx_sms_conversations_phone ON sms_conversations(phone_number);
CREATE INDEX idx_sms_conversations_created ON sms_conversations(created_at DESC);

-- RLS policies
ALTER TABLE sms_conversations ENABLE ROW LEVEL SECURITY;

-- Admins can see all messages
CREATE POLICY "Admins can view all SMS conversations"
  ON sms_conversations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Service role can insert (for webhook)
CREATE POLICY "Service role can insert SMS conversations"
  ON sms_conversations
  FOR INSERT
  TO service_role
  WITH CHECK (true);
