-- Fix chat_sessions foreign key to reference users table instead of auth.users
-- This aligns with how the rest of the app uses the users table

-- Drop the old foreign key constraint
ALTER TABLE chat_sessions 
DROP CONSTRAINT IF EXISTS chat_sessions_user_id_fkey;

-- Add new foreign key constraint pointing to users table
ALTER TABLE chat_sessions
ADD CONSTRAINT chat_sessions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Update RLS policies to work with users table
-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can view public chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can create their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can update their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can delete their own chat sessions" ON chat_sessions;

-- Recreate policies using users table
CREATE POLICY "Users can view their own chat sessions"
  ON chat_sessions FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can view public chat sessions"
  ON chat_sessions FOR SELECT
  USING (visibility = 'public');

CREATE POLICY "Users can create their own chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own chat sessions"
  ON chat_sessions FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own chat sessions"
  ON chat_sessions FOR DELETE
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

-- Update chat_messages policies
DROP POLICY IF EXISTS "Users can view messages in their sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can create messages in their sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete messages in their sessions" ON chat_messages;

CREATE POLICY "Users can view messages in their sessions"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions cs
      JOIN users u ON cs.user_id = u.id
      WHERE cs.id = chat_messages.chat_session_id
      AND (u.auth_id = auth.uid() OR cs.visibility = 'public')
    )
  );

CREATE POLICY "Users can create messages in their sessions"
  ON chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions cs
      JOIN users u ON cs.user_id = u.id
      WHERE cs.id = chat_messages.chat_session_id
      AND u.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages in their sessions"
  ON chat_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions cs
      JOIN users u ON cs.user_id = u.id
      WHERE cs.id = chat_messages.chat_session_id
      AND u.auth_id = auth.uid()
    )
  );

-- Update documents policies if they reference chat_sessions
DROP POLICY IF EXISTS "Users can view their own documents" ON documents;
DROP POLICY IF EXISTS "Users can view documents in public sessions" ON documents;
DROP POLICY IF EXISTS "Users can create their own documents" ON documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;

-- Fix documents table foreign key if needed
ALTER TABLE documents
DROP CONSTRAINT IF EXISTS documents_user_id_fkey;

ALTER TABLE documents
ADD CONSTRAINT documents_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE POLICY "Users can view their own documents"
  ON documents FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can view documents in public sessions"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = documents.chat_session_id
      AND chat_sessions.visibility = 'public'
    )
  );

-- Update votes table foreign key
ALTER TABLE votes
DROP CONSTRAINT IF EXISTS votes_user_id_fkey;

ALTER TABLE votes
ADD CONSTRAINT votes_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
