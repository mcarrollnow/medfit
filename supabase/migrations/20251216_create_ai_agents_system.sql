-- AI Agents Configuration System
-- Allows admins to configure, name, train, and manage AI assistants

-- Main AI Agents table
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  avatar_url TEXT,
  
  -- Agent Type/Purpose
  agent_type VARCHAR(50) NOT NULL DEFAULT 'general',
  -- Types: 'sms_support', 'order_confirmation', 'payment_collection', 'customer_support', 'general'
  
  -- Configuration
  is_active BOOLEAN DEFAULT true,
  model VARCHAR(50) DEFAULT 'claude-sonnet-4-20250514',
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 1024,
  
  -- Instructions & Training
  system_prompt TEXT NOT NULL,
  personality TEXT, -- Tone, style, etc.
  greeting_message TEXT, -- Default first message
  
  -- Capabilities
  can_send_sms BOOLEAN DEFAULT false,
  can_send_email BOOLEAN DEFAULT false,
  can_create_orders BOOLEAN DEFAULT false,
  can_modify_orders BOOLEAN DEFAULT false,
  can_issue_refunds BOOLEAN DEFAULT false,
  can_access_customer_data BOOLEAN DEFAULT true,
  can_access_order_data BOOLEAN DEFAULT true,
  can_escalate_to_human BOOLEAN DEFAULT true,
  
  -- Rate Limiting
  max_messages_per_hour INTEGER DEFAULT 100,
  max_messages_per_customer_per_day INTEGER DEFAULT 50,
  
  -- Metadata
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_agent_type CHECK (agent_type IN (
    'sms_support', 'order_confirmation', 'payment_collection', 
    'customer_support', 'general', 'sales', 'shipping'
  )),
  CONSTRAINT valid_temperature CHECK (temperature >= 0 AND temperature <= 2)
);

-- AI Agent Training Resources (documents, examples, etc.)
CREATE TABLE IF NOT EXISTS ai_agent_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  
  -- Resource Info
  title VARCHAR(255) NOT NULL,
  resource_type VARCHAR(50) NOT NULL, -- 'document', 'example', 'faq', 'policy', 'script'
  content TEXT NOT NULL,
  
  -- Metadata
  priority INTEGER DEFAULT 0, -- Higher = more important for context
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_resource_type CHECK (resource_type IN (
    'document', 'example', 'faq', 'policy', 'script', 'product_info', 'procedure'
  ))
);

-- AI Agent Conversation Examples (for training)
CREATE TABLE IF NOT EXISTS ai_agent_examples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  
  -- Example conversation
  user_message TEXT NOT NULL,
  ideal_response TEXT NOT NULL,
  context TEXT, -- Optional context for when this applies
  
  -- Categorization
  category VARCHAR(100), -- e.g., 'greeting', 'order_inquiry', 'complaint', 'payment'
  tags TEXT[], -- Additional tags for filtering
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Agent Activity Logs
CREATE TABLE IF NOT EXISTS ai_agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  
  -- Activity Info
  activity_type VARCHAR(50) NOT NULL, -- 'message_sent', 'message_received', 'action_taken', 'error'
  customer_phone VARCHAR(20),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  -- Content
  input_message TEXT,
  output_message TEXT,
  action_taken TEXT,
  metadata JSONB,
  
  -- Performance
  response_time_ms INTEGER,
  tokens_used INTEGER,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_agents_slug ON ai_agents(slug);
CREATE INDEX IF NOT EXISTS idx_ai_agents_type ON ai_agents(agent_type);
CREATE INDEX IF NOT EXISTS idx_ai_agents_active ON ai_agents(is_active);
CREATE INDEX IF NOT EXISTS idx_ai_agent_resources_agent ON ai_agent_resources(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_examples_agent ON ai_agent_examples(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_agent ON ai_agent_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_created ON ai_agent_logs(created_at);

-- RLS Policies
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_logs ENABLE ROW LEVEL SECURITY;

-- Admins can manage all AI agents
CREATE POLICY "Admins can manage ai_agents"
ON ai_agents FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.role = 'admin')
);

CREATE POLICY "Admins can manage ai_agent_resources"
ON ai_agent_resources FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.role = 'admin')
);

CREATE POLICY "Admins can manage ai_agent_examples"
ON ai_agent_examples FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.role = 'admin')
);

CREATE POLICY "Admins can view ai_agent_logs"
ON ai_agent_logs FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.role = 'admin')
);

-- Service role full access
CREATE POLICY "Service role ai_agents" ON ai_agents FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role ai_agent_resources" ON ai_agent_resources FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role ai_agent_examples" ON ai_agent_examples FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role ai_agent_logs" ON ai_agent_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_ai_agent_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_ai_agent_timestamp ON ai_agents;
CREATE TRIGGER trigger_update_ai_agent_timestamp
BEFORE UPDATE ON ai_agents
FOR EACH ROW
EXECUTE FUNCTION update_ai_agent_timestamp();

DROP TRIGGER IF EXISTS trigger_update_ai_agent_resource_timestamp ON ai_agent_resources;
CREATE TRIGGER trigger_update_ai_agent_resource_timestamp
BEFORE UPDATE ON ai_agent_resources
FOR EACH ROW
EXECUTE FUNCTION update_ai_agent_timestamp();

-- Insert default agents
INSERT INTO ai_agents (name, slug, description, agent_type, system_prompt, personality, can_send_sms, can_access_customer_data, can_access_order_data)
VALUES 
  (
    'SMS Support Agent',
    'sms-support',
    'Handles incoming SMS messages from customers, answers questions, and provides order updates',
    'sms_support',
    'You are a helpful customer support agent for a health products company. You respond to customer SMS messages with friendly, concise replies. Keep responses under 160 characters when possible for SMS compatibility. Be helpful but do not make promises you cannot keep. If you cannot help, offer to escalate to a human.',
    'Friendly, concise, professional',
    true,
    true,
    true
  ),
  (
    'Order Confirmation Agent',
    'order-confirmation',
    'Sends order confirmation messages and shipping updates via SMS',
    'order_confirmation',
    'You send order confirmation and shipping update messages to customers. Be clear, concise, and include relevant order details like order number and expected delivery. Keep messages professional and informative.',
    'Professional, informative, reassuring',
    true,
    true,
    true
  ),
  (
    'Payment Collection Agent',
    'payment-collection',
    'Sends payment links and reminders via SMS for unpaid orders',
    'payment_collection',
    'You help collect payments by sending payment links to customers. Be polite and professional. Include the order total and a clear call to action. Do not be pushy but be clear about payment expectations.',
    'Polite, clear, professional',
    true,
    true,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- AI Agent Webhooks/Triggers Configuration
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

CREATE POLICY "Admins can manage ai_agent_webhooks"
ON ai_agent_webhooks FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.role IN ('admin', 'superadmin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.role IN ('admin', 'superadmin'))
);

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

