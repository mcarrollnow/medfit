-- Create email_templates table for storing custom email templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL UNIQUE,
  subject TEXT,
  content JSONB,
  html TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on type for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(type);

-- Add comment
COMMENT ON TABLE email_templates IS 'Custom email templates for Supabase Auth emails';

-- RLS policies
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated admins to read/write
CREATE POLICY "Admins can manage email templates" ON email_templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Or if you want service role only access:
-- CREATE POLICY "Service role can manage email templates" ON email_templates
--   FOR ALL
--   USING (auth.role() = 'service_role');

-- Insert default templates
INSERT INTO email_templates (type, subject, content, html) VALUES
  ('confirmation', 'Confirm your email', NULL, '<h2>Confirm your email</h2><p>Follow this link to confirm your email:</p><p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>'),
  ('invite', 'You have been invited', NULL, '<h2>You have been invited</h2><p>You have been invited to join. Follow this link to accept the invitation:</p><p><a href="{{ .ConfirmationURL }}">Accept invitation</a></p>'),
  ('magic_link', 'Your login link', NULL, '<h2>Magic Link</h2><p>Follow this link to login:</p><p><a href="{{ .ConfirmationURL }}">Log in</a></p>'),
  ('recovery', 'Reset your password', NULL, '<h2>Reset Password</h2><p>Follow this link to reset your password:</p><p><a href="{{ .ConfirmationURL }}">Reset password</a></p>'),
  ('email_change', 'Confirm email change', NULL, '<h2>Confirm Email Change</h2><p>Follow this link to confirm the change to your email:</p><p><a href="{{ .ConfirmationURL }}">Confirm email change</a></p>')
ON CONFLICT (type) DO NOTHING;

