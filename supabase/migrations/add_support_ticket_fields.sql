-- Add support ticket fields to chat_sessions table

ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS session_type TEXT NOT NULL DEFAULT 'chat',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS customer_email TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS customer_name TEXT DEFAULT NULL;

-- Add constraints for the new fields
ALTER TABLE chat_sessions
DROP CONSTRAINT IF EXISTS chat_sessions_session_type_check,
ADD CONSTRAINT chat_sessions_session_type_check CHECK (session_type IN ('chat', 'support_ticket'));

ALTER TABLE chat_sessions
DROP CONSTRAINT IF EXISTS chat_sessions_status_check,
ADD CONSTRAINT chat_sessions_status_check CHECK (status IS NULL OR status IN ('open', 'in_progress', 'resolved', 'closed'));

ALTER TABLE chat_sessions
DROP CONSTRAINT IF EXISTS chat_sessions_priority_check,
ADD CONSTRAINT chat_sessions_priority_check CHECK (priority IS NULL OR priority IN ('low', 'medium', 'high', 'urgent'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_type ON chat_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_priority ON chat_sessions(priority);

COMMENT ON COLUMN chat_sessions.session_type IS 'Type of session: chat (regular conversation) or support_ticket (customer support)';
COMMENT ON COLUMN chat_sessions.status IS 'Status of support ticket: open, in_progress, resolved, closed';
COMMENT ON COLUMN chat_sessions.priority IS 'Priority level: low, medium, high, urgent';
COMMENT ON COLUMN chat_sessions.customer_email IS 'Customer email for support tickets';
COMMENT ON COLUMN chat_sessions.customer_name IS 'Customer name for support tickets';
