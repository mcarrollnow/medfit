-- SMS Customer Profiles
-- Stores AI-learned information about customers for better personalization

CREATE TABLE IF NOT EXISTS sms_customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Profile info
  first_name TEXT,
  preferred_name TEXT,
  
  -- AI-learned notes
  notes JSONB DEFAULT '[]'::jsonb, -- Array of {date, note, learned_from}
  preferences JSONB DEFAULT '{}'::jsonb, -- {communication_style, product_interests, etc}
  
  -- Conversation history references
  conversation_summaries JSONB DEFAULT '[]'::jsonb, -- Array of {session_id, date, summary, topics}
  
  -- Stats
  total_conversations INTEGER DEFAULT 0,
  last_conversation_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_sms_profiles_phone ON sms_customer_profiles(phone_number);
CREATE INDEX idx_sms_profiles_customer ON sms_customer_profiles(customer_id);

-- RLS Policies
ALTER TABLE sms_customer_profiles ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access"
  ON sms_customer_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_sms_customer_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_sms_customer_profiles_updated_at
  BEFORE UPDATE ON sms_customer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_sms_customer_profiles_updated_at();

-- Add session_id to sms_conversations for linking
ALTER TABLE sms_conversations 
ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES sms_sessions(id) ON DELETE SET NULL;

-- Create index for session lookups
CREATE INDEX IF NOT EXISTS idx_sms_conversations_session ON sms_conversations(session_id);
