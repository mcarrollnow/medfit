-- Print Jobs Table for Label Printing System
-- This table stores print jobs that are picked up by the desktop print agent

CREATE TABLE IF NOT EXISTS print_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Job identification
  job_type TEXT NOT NULL CHECK (job_type IN ('shipping_label', 'product_label', 'packing_slip', 'receipt')),
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'printing', 'completed', 'failed', 'cancelled')),
  
  -- Related order (optional - for shipping labels)
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  order_number TEXT,
  
  -- Label content (JSON with all data needed to print)
  label_data JSONB NOT NULL,
  
  -- Printer targeting (optional - for multi-printer setups)
  printer_id TEXT,
  
  -- Retry handling
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  last_error TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  printed_at TIMESTAMPTZ,
  
  -- Who/what created this job
  created_by TEXT, -- 'webhook', 'manual', 'admin:{user_id}'
  
  -- Priority (lower = higher priority)
  priority INTEGER DEFAULT 5
);

-- Index for efficient polling by print agent
CREATE INDEX idx_print_jobs_pending ON print_jobs(status, priority, created_at) 
  WHERE status = 'pending';

-- Index for order lookups
CREATE INDEX idx_print_jobs_order ON print_jobs(order_id) WHERE order_id IS NOT NULL;

-- Index for status filtering
CREATE INDEX idx_print_jobs_status ON print_jobs(status);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_print_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER print_jobs_updated_at
  BEFORE UPDATE ON print_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_print_jobs_updated_at();

-- Enable Realtime for this table (critical for instant notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE print_jobs;

-- RLS Policies
ALTER TABLE print_jobs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view print jobs
CREATE POLICY "Allow authenticated read" ON print_jobs
  FOR SELECT TO authenticated USING (true);

-- Allow service role full access (for webhooks/API)
CREATE POLICY "Allow service role all" ON print_jobs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Comments for documentation
COMMENT ON TABLE print_jobs IS 'Queue for label printing jobs picked up by desktop print agent';
COMMENT ON COLUMN print_jobs.label_data IS 'JSON containing all data needed to render the label (address, items, barcode, etc)';
COMMENT ON COLUMN print_jobs.printer_id IS 'Optional printer identifier for multi-printer setups';
