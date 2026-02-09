-- Create PCI scan schedules table
CREATE TABLE IF NOT EXISTS pci_scan_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_name TEXT NOT NULL,
  scanner_provider TEXT NOT NULL DEFAULT 'SecurityMetrics',
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_pci_scan_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pci_scan_schedules_updated_at
  BEFORE UPDATE ON pci_scan_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_pci_scan_schedules_updated_at();

-- Create PCI scanner IPs table (whitelisted IPs)
CREATE TABLE IF NOT EXISTS pci_scanner_ips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_range TEXT NOT NULL UNIQUE,
  description TEXT,
  provider TEXT NOT NULL DEFAULT 'SecurityMetrics',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert the scanner IP ranges
INSERT INTO pci_scanner_ips (ip_range, description, provider) VALUES
  ('64.39.96.0/20', 'SecurityMetrics Primary Scanner Range', 'SecurityMetrics'),
  ('154.59.121.0/24', 'SecurityMetrics Scanner Range', 'SecurityMetrics'),
  ('139.87.104.123/32', 'SecurityMetrics Scanner IP', 'SecurityMetrics'),
  ('139.87.117.66/32', 'SecurityMetrics Scanner IP', 'SecurityMetrics'),
  ('139.87.112.0/23', 'SecurityMetrics Scanner Range', 'SecurityMetrics'),
  ('141.144.196.156/32', 'SecurityMetrics Scanner IP', 'SecurityMetrics'),
  ('158.101.209.126/32', 'SecurityMetrics Scanner IP', 'SecurityMetrics'),
  ('34.33.2.64/26', 'SecurityMetrics Scanner Range', 'SecurityMetrics')
ON CONFLICT (ip_range) DO NOTHING;

-- Enable RLS
ALTER TABLE pci_scan_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE pci_scanner_ips ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage scan schedules
CREATE POLICY "Admins can manage pci_scan_schedules"
  ON pci_scan_schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Allow admins to view and manage scanner IPs
CREATE POLICY "Admins can manage pci_scanner_ips"
  ON pci_scanner_ips FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create index for faster queries
CREATE INDEX idx_pci_scan_schedules_status ON pci_scan_schedules(status);
CREATE INDEX idx_pci_scan_schedules_scheduled_start ON pci_scan_schedules(scheduled_start);
