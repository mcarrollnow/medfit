-- Migration: Secure Invoice Access & Auto Customer Creation
-- Run this in your Supabase SQL editor

-- Add customer_id to invoices table to link invoices to customer accounts
ALTER TABLE authorize_net_invoices 
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id),
  ADD COLUMN IF NOT EXISTS account_setup_token TEXT,
  ADD COLUMN IF NOT EXISTS account_setup_completed BOOLEAN DEFAULT FALSE;

-- Index for fast customer invoice lookups
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON authorize_net_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_email ON authorize_net_invoices(customer_email);
CREATE INDEX IF NOT EXISTS idx_invoices_account_setup_token ON authorize_net_invoices(account_setup_token);

COMMENT ON COLUMN authorize_net_invoices.customer_id IS 'Links invoice to customer account for access control';
COMMENT ON COLUMN authorize_net_invoices.account_setup_token IS 'One-time token for new customers to set up their account';
COMMENT ON COLUMN authorize_net_invoices.account_setup_completed IS 'Whether the new customer has completed account setup';
