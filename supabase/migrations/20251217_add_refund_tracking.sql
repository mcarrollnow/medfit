-- Add refund tracking columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_status TEXT CHECK (refund_status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_destination TEXT CHECK (refund_destination IN ('original_payment', 'store_credit', 'manual'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_customer_message TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_initiated_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_completed_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_initiated_by TEXT;

-- Create refund timeline table for tracking refund status updates
CREATE TABLE IF NOT EXISTS refund_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_refund_status ON orders(refund_status) WHERE refund_status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_refund_timeline_order ON refund_timeline(order_id);

-- Enable RLS on refund_timeline
ALTER TABLE refund_timeline ENABLE ROW LEVEL SECURITY;

-- Allow admins to read/write refund timeline
CREATE POLICY "Allow admins to manage refund timeline" ON refund_timeline
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'rep')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'rep')
    )
  );

