-- Customer Messages System
-- Allows reps to message customers directly

-- Create customer_messages table
CREATE TABLE IF NOT EXISTS customer_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  rep_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('rep', 'customer')),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customer_rep_assignments audit table
-- Tracks when customers are assigned/unassigned to reps
CREATE TABLE IF NOT EXISTS customer_rep_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  rep_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  unassigned_at TIMESTAMPTZ,
  is_current BOOLEAN DEFAULT TRUE,
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_customer_messages_customer ON customer_messages(customer_id);
CREATE INDEX idx_customer_messages_rep ON customer_messages(rep_id);
CREATE INDEX idx_customer_messages_created ON customer_messages(created_at DESC);
CREATE INDEX idx_customer_rep_assignments_customer ON customer_rep_assignments(customer_id);
CREATE INDEX idx_customer_rep_assignments_rep ON customer_rep_assignments(rep_id);
CREATE INDEX idx_customer_rep_assignments_current ON customer_rep_assignments(is_current) WHERE is_current = TRUE;

-- RLS Policies for customer_messages

-- Enable RLS
ALTER TABLE customer_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_rep_assignments ENABLE ROW LEVEL SECURITY;

-- Reps can view messages for their assigned customers
CREATE POLICY "Reps can view their customer messages"
  ON customer_messages
  FOR SELECT
  USING (
    rep_id = auth.uid()
    OR (
      sender_type = 'customer'
      AND customer_id IN (
        SELECT id FROM customers WHERE rep_id = auth.uid()
      )
    )
  );

-- Reps can insert messages to their assigned customers
CREATE POLICY "Reps can send messages to their customers"
  ON customer_messages
  FOR INSERT
  WITH CHECK (
    sender_type = 'rep'
    AND rep_id = auth.uid()
    AND customer_id IN (
      SELECT id FROM customers WHERE rep_id = auth.uid()
    )
  );

-- Customers can view their own messages
CREATE POLICY "Customers can view their messages"
  ON customer_messages
  FOR SELECT
  USING (
    sender_type = 'customer'
    AND customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- Customers can send messages to their assigned rep
CREATE POLICY "Customers can send messages to their rep"
  ON customer_messages
  FOR INSERT
  WITH CHECK (
    sender_type = 'customer'
    AND customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
  ON customer_messages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for customer_rep_assignments

-- Admins can manage all assignments
CREATE POLICY "Admins can manage assignments"
  ON customer_rep_assignments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Reps can view their own assignments
CREATE POLICY "Reps can view their assignments"
  ON customer_rep_assignments
  FOR SELECT
  USING (
    rep_id = auth.uid()
  );

-- Function to automatically create assignment audit trail
CREATE OR REPLACE FUNCTION track_customer_rep_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- If rep_id changed
  IF (TG_OP = 'UPDATE' AND OLD.rep_id IS DISTINCT FROM NEW.rep_id) THEN
    -- Mark old assignment as not current
    IF OLD.rep_id IS NOT NULL THEN
      UPDATE customer_rep_assignments
      SET is_current = FALSE, unassigned_at = NOW()
      WHERE customer_id = OLD.id AND rep_id = OLD.rep_id AND is_current = TRUE;
    END IF;
    
    -- Create new assignment record
    IF NEW.rep_id IS NOT NULL THEN
      INSERT INTO customer_rep_assignments (customer_id, rep_id, assigned_by)
      VALUES (NEW.id, NEW.rep_id, auth.uid());
    END IF;
  END IF;
  
  -- If new customer with rep assigned
  IF (TG_OP = 'INSERT' AND NEW.rep_id IS NOT NULL) THEN
    INSERT INTO customer_rep_assignments (customer_id, rep_id, assigned_by)
    VALUES (NEW.id, NEW.rep_id, auth.uid());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS track_rep_assignment_trigger ON customers;
CREATE TRIGGER track_rep_assignment_trigger
  AFTER INSERT OR UPDATE OF rep_id ON customers
  FOR EACH ROW
  EXECUTE FUNCTION track_customer_rep_assignment();

-- Function to get order history for rep (only orders during assignment period)
CREATE OR REPLACE FUNCTION get_rep_customer_orders(
  p_rep_id UUID,
  p_customer_id UUID
)
RETURNS TABLE (
  order_id UUID,
  order_number VARCHAR,
  total_amount NUMERIC,
  status VARCHAR,
  payment_status VARCHAR,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.order_number,
    o.total_amount,
    o.status,
    o.payment_status,
    o.created_at
  FROM orders o
  WHERE o.customer_id = p_customer_id
  AND EXISTS (
    -- Order was created while customer was assigned to this rep
    SELECT 1 FROM customer_rep_assignments cra
    WHERE cra.customer_id = p_customer_id
    AND cra.rep_id = p_rep_id
    AND o.created_at >= cra.assigned_at
    AND (cra.unassigned_at IS NULL OR o.created_at <= cra.unassigned_at)
  )
  ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_rep_customer_orders(UUID, UUID) TO authenticated;

-- Update updated_at timestamp on messages
CREATE OR REPLACE FUNCTION update_customer_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_messages_timestamp
  BEFORE UPDATE ON customer_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_messages_updated_at();

-- Comments
COMMENT ON TABLE customer_messages IS 'Direct messages between reps and their assigned customers';
COMMENT ON TABLE customer_rep_assignments IS 'Audit trail of customer-rep assignments over time';
COMMENT ON FUNCTION get_rep_customer_orders IS 'Returns orders for a customer that were created during their assignment to a specific rep';
