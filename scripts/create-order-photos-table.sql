-- Create order_photos table to track photos attached to orders
CREATE TABLE IF NOT EXISTS order_photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id text NOT NULL,
  url text NOT NULL,
  filename text NOT NULL,
  size bigint,
  content_type text,
  storage_path text,
  uploaded_by text,
  created_at timestamptz DEFAULT now()
);

-- Index for fast lookups by order
CREATE INDEX IF NOT EXISTS idx_order_photos_order_id ON order_photos(order_id);
