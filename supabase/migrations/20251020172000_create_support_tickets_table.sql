-- Create support_tickets table
-- This table tracks support tickets separately from chat sessions

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_session_id UUID REFERENCES support_chat_sessions(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'medium',
  
  -- Rep system fields
  created_by_rep UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  notify_all_admins BOOLEAN DEFAULT false,
  
  -- AI agent fields
  ai_handling BOOLEAN DEFAULT true,
  ai_escalated BOOLEAN DEFAULT false,
  escalation_reason TEXT,
  escalation_date TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT support_tickets_status_check CHECK (status IN ('open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed')),
  CONSTRAINT support_tickets_priority_check CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_chat_session_id ON support_tickets(chat_session_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_order_id ON support_tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_by_rep ON support_tickets(created_by_rep);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_admin_id ON support_tickets(assigned_admin_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_ai_escalated ON support_tickets(ai_escalated);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers
CREATE POLICY "Customers can view their own tickets"
  ON support_tickets FOR SELECT
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

CREATE POLICY "Customers can create tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

-- RLS Policies for reps
CREATE POLICY "Reps can create support tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'rep'
      AND created_by_rep = users.id
    )
  );

CREATE POLICY "Reps can view their own tickets"
  ON support_tickets FOR SELECT
  USING (
    created_by_rep IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
    OR customer_id IN (
      SELECT id FROM customers WHERE rep_id IN (
        SELECT id FROM users WHERE auth_id = auth.uid()
      )
    )
  );

CREATE POLICY "Reps can update their own tickets"
  ON support_tickets FOR UPDATE
  USING (
    created_by_rep IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
    OR customer_id IN (
      SELECT id FROM customers WHERE rep_id IN (
        SELECT id FROM users WHERE auth_id = auth.uid()
      )
    )
  );

-- RLS Policies for admins
CREATE POLICY "Admins can view all tickets"
  ON support_tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all tickets"
  ON support_tickets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete tickets"
  ON support_tickets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE support_tickets IS 'Customer support tickets linked to chat sessions';
COMMENT ON COLUMN support_tickets.chat_session_id IS 'Links ticket to AI chat session for unified conversation history';
COMMENT ON COLUMN support_tickets.ai_handling IS 'Whether ticket is currently being handled by AI';
COMMENT ON COLUMN support_tickets.ai_escalated IS 'Whether ticket has been escalated to human';
