-- SAFE SCHEMA FOR RESEARCH HUB
-- All tables are prefixed with 'research_' to avoid conflicts with existing website tables

-- Sessions table for research hub
CREATE TABLE IF NOT EXISTS research_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  instructions TEXT,
  category TEXT NOT NULL CHECK (category IN ('price-research', 'peptide-research')),
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for chat history
CREATE TABLE IF NOT EXISTS research_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES research_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Peptides table for saved peptides
CREATE TABLE IF NOT EXISTS research_peptides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES research_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sequence TEXT NOT NULL,
  molecular_weight NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research data table for price research and analysis results
CREATE TABLE IF NOT EXISTS research_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES research_sessions(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL CHECK (data_type IN ('price-research', 'peptide-analysis', 'pubchem-data')),
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session state table for current builder state
CREATE TABLE IF NOT EXISTS research_session_state (
  session_id UUID PRIMARY KEY REFERENCES research_sessions(id) ON DELETE CASCADE,
  state JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_research_sessions_category ON research_sessions(category);
CREATE INDEX IF NOT EXISTS idx_research_sessions_archived ON research_sessions(archived);
CREATE INDEX IF NOT EXISTS idx_research_messages_session ON research_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_research_peptides_session ON research_peptides(session_id);
CREATE INDEX IF NOT EXISTS idx_research_data_session ON research_data(session_id);

-- Enable Row Level Security
ALTER TABLE research_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_peptides ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_session_state ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (customize based on your auth setup)
CREATE POLICY "Allow all operations on research_sessions" ON research_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on research_messages" ON research_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on research_peptides" ON research_peptides FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on research_data" ON research_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on research_session_state" ON research_session_state FOR ALL USING (true) WITH CHECK (true);
