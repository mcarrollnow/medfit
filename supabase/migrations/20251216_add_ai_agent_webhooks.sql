-- AI Agent Webhooks/Triggers Configuration
-- Run this if ai_agents table already exists

CREATE TABLE IF NOT EXISTS ai_agent_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  
  -- Webhook Info
  name VARCHAR(100) NOT NULL,
  description TEXT,
  webhook_type VARCHAR(50) NOT NULL, -- 'incoming', 'outgoing', 'trigger'
  
  -- For incoming webhooks (external services calling us)
  endpoint_path VARCHAR(255), -- e.g., '/api/sms/incoming'
  secret_key VARCHAR(255), -- For webhook authentication
  
  -- For outgoing webhooks (we call external services)
  target_url TEXT,
  http_method VARCHAR(10) DEFAULT 'POST',
  headers JSONB DEFAULT '{}',
  
  -- Trigger conditions
  trigger_event VARCHAR(100), -- e.g., 'sms.incoming', 'order.created', 'payment.pending'
  trigger_conditions JSONB DEFAULT '{}', -- Additional filter conditions
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  trigger_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_agent_webhooks_agent ON ai_agent_webhooks(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_webhooks_event ON ai_agent_webhooks(trigger_event);

ALTER TABLE ai_agent_webhooks ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist, then create
DROP POLICY IF EXISTS "Admins can manage ai_agent_webhooks" ON ai_agent_webhooks;
CREATE POLICY "Admins can manage ai_agent_webhooks"
ON ai_agent_webhooks FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.role IN ('admin', 'superadmin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.role IN ('admin', 'superadmin'))
);

DROP POLICY IF EXISTS "Service role ai_agent_webhooks" ON ai_agent_webhooks;
CREATE POLICY "Service role ai_agent_webhooks" ON ai_agent_webhooks FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Insert default webhook configurations
INSERT INTO ai_agent_webhooks (agent_id, name, description, webhook_type, endpoint_path, trigger_event)
SELECT 
  id,
  'Incoming SMS',
  'Triggered when a customer sends an SMS message',
  'incoming',
  '/api/sms/incoming',
  'sms.incoming'
FROM ai_agents WHERE slug = 'sms-support'
ON CONFLICT DO NOTHING;

INSERT INTO ai_agent_webhooks (agent_id, name, description, webhook_type, trigger_event)
SELECT 
  id,
  'Order Created',
  'Triggered when a new order is created',
  'trigger',
  'order.created'
FROM ai_agents WHERE slug = 'order-confirmation'
ON CONFLICT DO NOTHING;

INSERT INTO ai_agent_webhooks (agent_id, name, description, webhook_type, trigger_event)
SELECT 
  id,
  'Payment Pending',
  'Triggered when an order is awaiting payment',
  'trigger',
  'payment.pending'
FROM ai_agents WHERE slug = 'payment-collection'
ON CONFLICT DO NOTHING;

