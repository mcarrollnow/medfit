-- Complete database schema for AI Research Hub
-- Run this in your Supabase SQL editor

-- Sessions table (already created, but included for completeness)
CREATE TABLE IF NOT EXISTS sessions (
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
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Peptides table for saved peptides in library
CREATE TABLE IF NOT EXISTS peptides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  sequence TEXT NOT NULL,
  molecular_weight NUMERIC,
  length INTEGER,
  isoelectric_point NUMERIC,
  net_charge NUMERIC,
  hydrophobicity NUMERIC,
  extinction_coefficient NUMERIC,
  description TEXT,
  pubchem_cid TEXT,
  smiles TEXT,
  molecular_formula TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research data table for price/product research
CREATE TABLE IF NOT EXISTS research_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('price', 'product', 'peptide-analysis')),
  query TEXT,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session state table for current builder/viewer state
CREATE TABLE IF NOT EXISTS session_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  state_type TEXT NOT NULL CHECK (state_type IN ('peptide-builder', 'price-research', 'viewer')),
  state_data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, state_type)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_category ON sessions(category);
CREATE INDEX IF NOT EXISTS idx_sessions_archived ON sessions(archived);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_peptides_session_id ON peptides(session_id);
CREATE INDEX IF NOT EXISTS idx_peptides_name ON peptides(name);
CREATE INDEX IF NOT EXISTS idx_research_data_session_id ON research_data(session_id);
CREATE INDEX IF NOT EXISTS idx_research_data_type ON research_data(type);
CREATE INDEX IF NOT EXISTS idx_session_state_session_id ON session_state(session_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE peptides ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_state ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (customize based on your auth setup)
CREATE POLICY "Allow all operations on sessions" ON sessions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on messages" ON messages
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on peptides" ON peptides
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on research_data" ON research_data
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on session_state" ON session_state
  FOR ALL USING (true) WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_peptides_updated_at BEFORE UPDATE ON peptides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_state_updated_at BEFORE UPDATE ON session_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
