-- Create table for unmatched tracking numbers that need manual review
CREATE TABLE IF NOT EXISTS unmatched_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT NOT NULL,
  carrier TEXT NOT NULL,
  ship_date DATE,
  order_reference TEXT,
  email_content TEXT,
  status TEXT DEFAULT 'pending_review', -- pending_review, matched, ignored
  matched_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_unmatched_tracking_status ON unmatched_tracking(status);
CREATE INDEX IF NOT EXISTS idx_unmatched_tracking_tracking_number ON unmatched_tracking(tracking_number);
CREATE INDEX IF NOT EXISTS idx_unmatched_tracking_created_at ON unmatched_tracking(created_at DESC);

-- RLS policies for admin access
ALTER TABLE unmatched_tracking ENABLE ROW LEVEL SECURITY;

-- Admin can view and manage all unmatched tracking
CREATE POLICY "Admins can view all unmatched tracking"
  ON unmatched_tracking
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update unmatched tracking"
  ON unmatched_tracking
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Service role can insert (for webhook)
CREATE POLICY "Service role can insert unmatched tracking"
  ON unmatched_tracking
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Comments
COMMENT ON TABLE unmatched_tracking IS 'Stores tracking numbers from USPS emails that could not be automatically matched to orders';
COMMENT ON COLUMN unmatched_tracking.tracking_number IS 'USPS tracking number from receipt email';
COMMENT ON COLUMN unmatched_tracking.email_content IS 'Excerpt of email content for manual review';
COMMENT ON COLUMN unmatched_tracking.status IS 'pending_review: needs manual review, matched: successfully matched, ignored: should be ignored';
