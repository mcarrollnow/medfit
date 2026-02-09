-- Create transactional email templates table
-- Stores editable HTML email templates for different email types

CREATE TABLE IF NOT EXISTS transactional_email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  -- Available variables for this template (for display in the editor)
  available_variables JSONB DEFAULT '[]'::jsonb,
  -- Whether this template is actively used
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on template_key for fast lookups
CREATE INDEX IF NOT EXISTS idx_transactional_email_templates_key ON transactional_email_templates(template_key);

-- Insert default templates

-- Invoice Email
INSERT INTO transactional_email_templates (template_key, name, description, subject, html_content, available_variables)
VALUES (
  'invoice',
  'Invoice Email',
  'Sent when an invoice is created and emailed to the customer',
  'Invoice {{invoice_number}} - ${{total}}',
  '',
  '["{{customer_name}}", "{{invoice_number}}", "{{total}}", "{{subtotal}}", "{{issue_date}}", "{{due_date}}", "{{invoice_url}}", "{{company_name}}"]'::jsonb
) ON CONFLICT (template_key) DO NOTHING;

-- Payment Reminder
INSERT INTO transactional_email_templates (template_key, name, description, subject, html_content, available_variables)
VALUES (
  'payment_reminder',
  'Payment Reminder',
  'Sent when admin sends a payment reminder for an unpaid order',
  'Payment Reminder - Order {{order_number}}',
  '',
  '["{{customer_name}}", "{{order_number}}", "{{total_amount}}", "{{payment_url}}", "{{company_name}}"]'::jsonb
) ON CONFLICT (template_key) DO NOTHING;

-- Commission Payment
INSERT INTO transactional_email_templates (template_key, name, description, subject, html_content, available_variables)
VALUES (
  'commission_payment',
  'Commission Payment Notification',
  'Sent to reps when they receive a commission payment',
  'Commission Payment: {{payment_amount}} {{currency}}',
  '',
  '["{{rep_name}}", "{{payment_amount}}", "{{currency}}", "{{payment_report_url}}", "{{company_name}}"]'::jsonb
) ON CONFLICT (template_key) DO NOTHING;

-- Welcome Email
INSERT INTO transactional_email_templates (template_key, name, description, subject, html_content, available_variables)
VALUES (
  'welcome',
  'Welcome Email',
  'Sent when a new customer account is created',
  'Welcome to Modern Health Pro',
  '',
  '["{{first_name}}", "{{login_url}}", "{{company_name}}"]'::jsonb
) ON CONFLICT (template_key) DO NOTHING;

-- Order Confirmation
INSERT INTO transactional_email_templates (template_key, name, description, subject, html_content, available_variables)
VALUES (
  'order_confirmation',
  'Order Confirmation',
  'Sent when an order payment is confirmed',
  'Order Confirmed - {{order_number}}',
  '',
  '["{{customer_name}}", "{{order_number}}", "{{total_amount}}", "{{order_url}}", "{{company_name}}"]'::jsonb
) ON CONFLICT (template_key) DO NOTHING;

-- Shipping Notification
INSERT INTO transactional_email_templates (template_key, name, description, subject, html_content, available_variables)
VALUES (
  'shipping_notification',
  'Shipping Notification',
  'Sent when an order is shipped with tracking info',
  'Your Order {{order_number}} Has Shipped!',
  '',
  '["{{customer_name}}", "{{order_number}}", "{{tracking_number}}", "{{carrier}}", "{{tracking_url}}", "{{company_name}}"]'::jsonb
) ON CONFLICT (template_key) DO NOTHING;
