-- Fix RLS policies for support_chat_sessions and support_chat_messages
-- Add admin policies to ensure proper access for support ticket system

-- Drop existing admin policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Admins can view all support chat sessions" ON support_chat_sessions;
DROP POLICY IF EXISTS "Admins can create support chat sessions" ON support_chat_sessions;
DROP POLICY IF EXISTS "Admins can update all support chat sessions" ON support_chat_sessions;
DROP POLICY IF EXISTS "Admins can delete all support chat sessions" ON support_chat_sessions;
DROP POLICY IF EXISTS "Admins can view all support chat messages" ON support_chat_messages;
DROP POLICY IF EXISTS "Admins can create support chat messages" ON support_chat_messages;
DROP POLICY IF EXISTS "Admins can update support chat messages" ON support_chat_messages;
DROP POLICY IF EXISTS "Admins can delete all support chat messages" ON support_chat_messages;

-- Admin policies for support_chat_sessions
CREATE POLICY "Admins can view all support chat sessions"
  ON support_chat_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can create support chat sessions"
  ON support_chat_sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all support chat sessions"
  ON support_chat_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete all support chat sessions"
  ON support_chat_sessions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admin policies for support_chat_messages
CREATE POLICY "Admins can view all support chat messages"
  ON support_chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can create support chat messages"
  ON support_chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update support chat messages"
  ON support_chat_messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete all support chat messages"
  ON support_chat_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Add comments
COMMENT ON POLICY "Admins can view all support chat sessions" ON support_chat_sessions IS 'Allows admins to view all support chat sessions';
COMMENT ON POLICY "Admins can view all support chat messages" ON support_chat_messages IS 'Allows admins to view all support chat messages';
