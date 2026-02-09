-- Create SMS devices table for gateway registration
CREATE TABLE IF NOT EXISTS sms_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fcm_token TEXT UNIQUE NOT NULL,
  device_name TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups of active devices
CREATE INDEX IF NOT EXISTS idx_sms_devices_active ON sms_devices(active);
CREATE INDEX IF NOT EXISTS idx_sms_devices_updated ON sms_devices(updated_at DESC);

-- RLS Policies (admin only can manage devices)
ALTER TABLE sms_devices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage SMS devices" ON sms_devices;
DROP POLICY IF EXISTS "Service role can manage SMS devices" ON sms_devices;

-- Admin can do everything
CREATE POLICY "Admins can manage SMS devices"
  ON sms_devices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Service role can do everything (for API)
CREATE POLICY "Service role can manage SMS devices"
  ON sms_devices
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_sms_devices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_sms_devices_updated_at ON sms_devices;

CREATE TRIGGER update_sms_devices_updated_at
  BEFORE UPDATE ON sms_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_sms_devices_updated_at();

-- Add comment
COMMENT ON TABLE sms_devices IS 'Registered Android SMS gateway devices';
