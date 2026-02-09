-- Sales Rep System Migration
-- Adds rep role, customer assignment, enhanced support tickets, and commission tracking
-- FIXED: Uses auth_id = auth.uid() to match users table structure

-- 1. Add rep_id to customers table for rep assignment
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS rep_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Index for faster rep customer lookups
CREATE INDEX IF NOT EXISTS idx_customers_rep_id ON customers(rep_id);

-- 2. Add commission tracking to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS total_commission_earned DECIMAL(10,2) DEFAULT 0.00;

-- 3. Enhance support_tickets table for rep workflow
ALTER TABLE support_tickets
ADD COLUMN IF NOT EXISTS created_by_rep UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS assigned_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS notify_all_admins BOOLEAN DEFAULT false;

-- Add indexes for ticket queries
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_by_rep ON support_tickets(created_by_rep);
CREATE INDEX IF NOT EXISTS idx_support_tickets_order_id ON support_tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_admin_id ON support_tickets(assigned_admin_id);

-- 4. Create commission_statements table for tracking sent statements
CREATE TABLE IF NOT EXISTS commission_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_sales DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  commission_earned DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  statement_data JSONB NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for commission statement lookups
CREATE INDEX IF NOT EXISTS idx_commission_statements_rep_id ON commission_statements(rep_id);
CREATE INDEX IF NOT EXISTS idx_commission_statements_period ON commission_statements(period_start, period_end);

-- 5. RLS Policies for customers (reps can view their assigned customers)
DROP POLICY IF EXISTS "Reps can view assigned customers" ON customers;
CREATE POLICY "Reps can view assigned customers" ON customers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'rep'
      AND customers.rep_id = users.id
    )
  );

-- 6. RLS Policies for orders (reps can view orders from their assigned customers)
DROP POLICY IF EXISTS "Reps can view orders from assigned customers" ON orders;
CREATE POLICY "Reps can view orders from assigned customers" ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      INNER JOIN customers ON customers.rep_id = users.id
      WHERE users.auth_id = auth.uid()
      AND users.role = 'rep'
      AND orders.customer_id = customers.id
    )
  );

-- 7. RLS Policies for support_tickets (reps can view and create tickets)
DROP POLICY IF EXISTS "Reps can create support tickets" ON support_tickets;
CREATE POLICY "Reps can create support tickets" ON support_tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'rep'
    )
  );

DROP POLICY IF EXISTS "Reps can view their own tickets" ON support_tickets;
CREATE POLICY "Reps can view their own tickets" ON support_tickets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND (
        (users.role = 'rep' AND created_by_rep = users.id)
        OR users.role = 'admin'
      )
    )
  );

DROP POLICY IF EXISTS "Reps can update their own tickets" ON support_tickets;
CREATE POLICY "Reps can update their own tickets" ON support_tickets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND (
        (users.role = 'rep' AND created_by_rep = users.id)
        OR users.role = 'admin'
      )
    )
  );

-- 8. RLS Policies for commission_statements (only admins can manage, reps can view their own)
ALTER TABLE commission_statements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins full access to commission statements" ON commission_statements;
CREATE POLICY "Admins full access to commission statements" ON commission_statements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Reps can view own commission statements" ON commission_statements;
CREATE POLICY "Reps can view own commission statements" ON commission_statements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'rep'
      AND users.id = rep_id
    )
  );

-- 9. Create function to calculate rep commission
CREATE OR REPLACE FUNCTION calculate_rep_commission(
  p_rep_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  order_id UUID,
  customer_id UUID,
  customer_name TEXT,
  order_date TIMESTAMP WITH TIME ZONE,
  order_total DECIMAL,
  commission_amount DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id AS order_id,
    o.customer_id,
    CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
    o.created_at AS order_date,
    o.total_amount AS order_total,
    ROUND(o.total_amount * (rep.commission_rate / 100), 2) AS commission_amount
  FROM orders o
  INNER JOIN customers c ON c.id = o.customer_id
  INNER JOIN users u ON u.id = c.user_id
  INNER JOIN users rep ON rep.id = p_rep_id
  WHERE c.rep_id = p_rep_id
    AND o.status = 'delivered'
    AND o.created_at::date BETWEEN p_start_date AND p_end_date
  ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (will still be protected by RLS)
GRANT EXECUTE ON FUNCTION calculate_rep_commission TO authenticated;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
