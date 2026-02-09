-- Crypto Assistant Tables
-- Separate tables for crypto payment assistance with exact naming conventions

-- Crypto Assistant Sessions (for payment-related conversations)
CREATE TABLE IF NOT EXISTS crypto_assistant_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL, -- Link to specific order
  order_number TEXT, -- Store order number for reference
  wallet_address TEXT, -- Crypto wallet address
  eth_amount DECIMAL(18,8), -- ETH amount for payment
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  title TEXT DEFAULT 'Crypto Payment Help',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crypto Assistant Messages (payment conversation history)
CREATE TABLE IF NOT EXISTS crypto_assistant_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES crypto_assistant_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'payment_link', 'status_update'
  metadata JSONB DEFAULT '{}', -- Store payment links, transaction hashes, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_crypto_sessions_user_id ON crypto_assistant_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_sessions_order_id ON crypto_assistant_sessions(order_id);
CREATE INDEX IF NOT EXISTS idx_crypto_sessions_created_at ON crypto_assistant_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crypto_messages_session_id ON crypto_assistant_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_crypto_messages_created_at ON crypto_assistant_messages(created_at);

-- Row Level Security
ALTER TABLE crypto_assistant_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_assistant_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Crypto Assistant Sessions
CREATE POLICY "Users can view their own crypto sessions"
  ON crypto_assistant_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own crypto sessions"
  ON crypto_assistant_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crypto sessions"
  ON crypto_assistant_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all crypto sessions"
  ON crypto_assistant_sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for Crypto Assistant Messages
CREATE POLICY "Users can view their own crypto messages"
  ON crypto_assistant_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM crypto_assistant_sessions
      WHERE crypto_assistant_sessions.id = crypto_assistant_messages.session_id
      AND crypto_assistant_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their crypto sessions"
  ON crypto_assistant_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM crypto_assistant_sessions
      WHERE crypto_assistant_sessions.id = crypto_assistant_messages.session_id
      AND crypto_assistant_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all crypto messages"
  ON crypto_assistant_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Update trigger for crypto sessions
CREATE TRIGGER update_crypto_sessions_updated_at
  BEFORE UPDATE ON crypto_assistant_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
