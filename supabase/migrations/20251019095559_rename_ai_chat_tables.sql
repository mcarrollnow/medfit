-- Rename AI Chat tables to be more specific for support/customer service
-- This separates them from crypto assistant functionality

-- Rename existing tables to be more specific
ALTER TABLE IF EXISTS chat_sessions RENAME TO support_chat_sessions;
ALTER TABLE IF EXISTS chat_messages RENAME TO support_chat_messages;

-- Update foreign key references
ALTER TABLE support_chat_messages 
  DROP CONSTRAINT IF EXISTS chat_messages_chat_session_id_fkey;

ALTER TABLE support_chat_messages 
  ADD CONSTRAINT support_chat_messages_session_id_fkey 
  FOREIGN KEY (chat_session_id) REFERENCES support_chat_sessions(id) ON DELETE CASCADE;

-- Update indexes
DROP INDEX IF EXISTS idx_chat_sessions_user_id;
DROP INDEX IF EXISTS idx_chat_sessions_created_at;
DROP INDEX IF EXISTS idx_chat_messages_session_id;
DROP INDEX IF EXISTS idx_chat_messages_created_at;

CREATE INDEX IF NOT EXISTS idx_support_chat_sessions_user_id ON support_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_support_chat_sessions_created_at ON support_chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_chat_messages_session_id ON support_chat_messages(chat_session_id);
CREATE INDEX IF NOT EXISTS idx_support_chat_messages_created_at ON support_chat_messages(created_at);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON support_chat_sessions;
DROP POLICY IF EXISTS "Users can view public chat sessions" ON support_chat_sessions;
DROP POLICY IF EXISTS "Users can create their own chat sessions" ON support_chat_sessions;
DROP POLICY IF EXISTS "Users can update their own chat sessions" ON support_chat_sessions;
DROP POLICY IF EXISTS "Users can delete their own chat sessions" ON support_chat_sessions;

DROP POLICY IF EXISTS "Users can view messages from their chat sessions" ON support_chat_messages;
DROP POLICY IF EXISTS "Users can create messages in their chat sessions" ON support_chat_messages;
DROP POLICY IF EXISTS "Users can delete messages from their chat sessions" ON support_chat_messages;

-- Recreate policies with new names
CREATE POLICY "Users can view their own support chat sessions"
  ON support_chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public support chat sessions"
  ON support_chat_sessions FOR SELECT
  USING (visibility = 'public');

CREATE POLICY "Users can create their own support chat sessions"
  ON support_chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own support chat sessions"
  ON support_chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own support chat sessions"
  ON support_chat_sessions FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages from their support chat sessions"
  ON support_chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM support_chat_sessions
      WHERE support_chat_sessions.id = support_chat_messages.chat_session_id
      AND (support_chat_sessions.user_id = auth.uid() OR support_chat_sessions.visibility = 'public')
    )
  );

CREATE POLICY "Users can create messages in their support chat sessions"
  ON support_chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_chat_sessions
      WHERE support_chat_sessions.id = support_chat_messages.chat_session_id
      AND support_chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages from their support chat sessions"
  ON support_chat_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM support_chat_sessions
      WHERE support_chat_sessions.id = support_chat_messages.chat_session_id
      AND support_chat_sessions.user_id = auth.uid()
    )
  );

-- Update trigger
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON support_chat_sessions;
CREATE TRIGGER update_support_chat_sessions_updated_at
  BEFORE UPDATE ON support_chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
