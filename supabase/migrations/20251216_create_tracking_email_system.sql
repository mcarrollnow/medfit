-- Create app_settings table for storing application configuration
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create tracking_email_logs table for logging processed emails
CREATE TABLE IF NOT EXISTS tracking_email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL,
  tracking_number TEXT NOT NULL,
  status TEXT NOT NULL, -- 'updated', 'already_has_tracking', 'order_not_found', 'update_failed'
  source TEXT DEFAULT 'email', -- 'email', 'manual'
  email_from TEXT,
  email_subject TEXT,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tracking_email_logs_created_at ON tracking_email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_email_logs_order_number ON tracking_email_logs(order_number);

-- Insert default tracking settings
INSERT INTO app_settings (key, value)
VALUES ('tracking_email_settings', '{"enabled": true, "webhook_url": "", "api_key": ""}')
ON CONFLICT (key) DO NOTHING;

