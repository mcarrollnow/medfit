-- SMS conversation session tracking for context management
CREATE TABLE IF NOT EXISTS sms_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  state TEXT NOT NULL DEFAULT 'idle', -- idle, awaiting_order_confirmation, awaiting_issue_type, awaiting_ticket_details
  context JSONB DEFAULT '{}', -- Store dynamic context (order_id, options, etc.)
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 minutes'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast phone number lookup
CREATE INDEX IF NOT EXISTS idx_sms_sessions_phone ON sms_sessions(phone_number);

-- Index for cleanup of expired sessions
CREATE INDEX IF NOT EXISTS idx_sms_sessions_expires ON sms_sessions(expires_at);

-- Enable RLS
ALTER TABLE sms_sessions ENABLE ROW LEVEL SECURITY;

-- Service role can manage all sessions
CREATE POLICY "Service role can manage SMS sessions"
  ON sms_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sms_sessions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM sms_sessions WHERE expires_at < NOW();
END;
$$;

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sms_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_sms_session_updated_at
  BEFORE UPDATE ON sms_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_sms_session_timestamp();

COMMENT ON TABLE sms_sessions IS 'Tracks SMS conversation context for multi-step interactions';
COMMENT ON COLUMN sms_sessions.state IS 'Current conversation state: idle, awaiting_order_confirmation, awaiting_issue_type, awaiting_ticket_details';
COMMENT ON COLUMN sms_sessions.context IS 'JSON object with conversation-specific data (order_id, options_sent, etc.)';
COMMENT ON COLUMN sms_sessions.expires_at IS 'Session expires after 30 minutes of inactivity';
