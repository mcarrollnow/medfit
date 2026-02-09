-- Add chat_session_id to support_tickets table
-- This links support tickets to chat sessions for unified AI SDK integration

ALTER TABLE support_tickets
ADD COLUMN chat_session_id uuid REFERENCES support_chat_sessions(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_support_tickets_chat_session_id 
ON support_tickets(chat_session_id);

-- Add comment
COMMENT ON COLUMN support_tickets.chat_session_id IS 'Links ticket to AI chat session for unified conversation history';
