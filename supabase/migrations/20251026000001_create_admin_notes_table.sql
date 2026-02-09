-- Create admin_notes table for internal notes on customers/tickets
-- These are private notes only visible to admins

CREATE TABLE IF NOT EXISTS admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name VARCHAR(255),
  note TEXT NOT NULL,
  note_type VARCHAR(50) DEFAULT 'general' CHECK (note_type IN ('general', 'warning', 'important', 'followup')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Must be related to either a customer or ticket
  CONSTRAINT admin_notes_relation_check CHECK (
    (customer_id IS NOT NULL AND ticket_id IS NULL) OR
    (customer_id IS NULL AND ticket_id IS NOT NULL) OR
    (customer_id IS NOT NULL AND ticket_id IS NOT NULL)
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_notes_customer_id ON admin_notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_ticket_id ON admin_notes(ticket_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_author_id ON admin_notes(author_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_created_at ON admin_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notes_note_type ON admin_notes(note_type);

-- Enable RLS
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Admins only
CREATE POLICY "Admins can view all admin notes"
  ON admin_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can create admin notes"
  ON admin_notes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update admin notes"
  ON admin_notes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete admin notes"
  ON admin_notes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_admin_notes_updated_at
  BEFORE UPDATE ON admin_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE admin_notes IS 'Private admin notes on customers and tickets';
COMMENT ON COLUMN admin_notes.note_type IS 'Category of note for filtering and display';
COMMENT ON COLUMN admin_notes.customer_id IS 'Links note to a customer';
COMMENT ON COLUMN admin_notes.ticket_id IS 'Links note to a specific ticket';
