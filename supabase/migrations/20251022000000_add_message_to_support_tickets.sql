-- Add message column to support_tickets table
-- This stores the initial customer message that created the ticket

ALTER TABLE support_tickets
ADD COLUMN IF NOT EXISTS message TEXT;

COMMENT ON COLUMN support_tickets.message IS 'Initial customer message that created the ticket';
