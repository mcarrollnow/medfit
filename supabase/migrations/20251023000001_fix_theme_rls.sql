-- Drop existing admin policy
DROP POLICY IF EXISTS "Admins can manage themes" ON themes;

-- Create separate policies for better control
CREATE POLICY "Admins can insert themes"
  ON themes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update themes"
  ON themes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete themes"
  ON themes
  FOR DELETE
  TO authenticated
  USING (
    NOT is_system -- Cannot delete system themes
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Service role bypasses RLS automatically, no need for specific policy
