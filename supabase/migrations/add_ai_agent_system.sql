-- AI Agent System for Support Tickets
-- Adds fields for tracking AI actions, approvals, and escalations

-- Add AI agent fields to support_tickets
ALTER TABLE support_tickets
ADD COLUMN IF NOT EXISTS ai_handling BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS ai_escalated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS escalation_reason TEXT,
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS last_ai_action_at TIMESTAMP WITH TIME ZONE;

-- Create table for AI proposed actions (pending approval)
CREATE TABLE IF NOT EXISTS ai_proposed_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'refund', 'order_cancel', 'credit', 'shipping_change', etc.
  action_data JSONB NOT NULL, -- Details of the action
  reason TEXT NOT NULL, -- Claude's explanation
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'denied'
  proposed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  CONSTRAINT ai_proposed_actions_status_check CHECK (status IN ('pending', 'approved', 'denied'))
);

-- Create table for AI activity log (for transparency)
CREATE TABLE IF NOT EXISTS ai_ticket_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'info_gathered', 'action_proposed', 'escalated', 'resolved'
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_proposed_actions_ticket_id ON ai_proposed_actions(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ai_proposed_actions_status ON ai_proposed_actions(status);
CREATE INDEX IF NOT EXISTS idx_ai_ticket_activity_ticket_id ON ai_ticket_activity(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_ai_escalated ON support_tickets(ai_escalated);

-- Add comment
COMMENT ON TABLE ai_proposed_actions IS 'Actions proposed by AI agent that require human approval';
COMMENT ON TABLE ai_ticket_activity IS 'Log of AI agent activities on tickets for transparency';
COMMENT ON COLUMN support_tickets.ai_handling IS 'Whether ticket is currently being handled by AI';
COMMENT ON COLUMN support_tickets.ai_escalated IS 'Whether ticket has been escalated to human';
COMMENT ON COLUMN support_tickets.escalation_reason IS 'Reason for escalation';
