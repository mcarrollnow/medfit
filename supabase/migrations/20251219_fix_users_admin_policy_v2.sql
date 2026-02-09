-- ============================================
-- FIX: Allow admins to view all users
-- Uses SECURITY DEFINER function to avoid RLS recursion
-- ============================================

-- Step 1: Create a function that checks if current user is admin
-- SECURITY DEFINER means this function runs with the privileges of the creator (bypasses RLS)
CREATE OR REPLACE FUNCTION is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  );
$$;

-- Step 2: Drop the existing policy
DROP POLICY IF EXISTS "Users can read own record" ON "public"."users";

-- Step 3: Create new policy that uses the function
CREATE POLICY "Users can read own record or admins can read all" ON "public"."users" 
FOR SELECT TO "authenticated" 
USING (
  -- Users can see their own record
  auth_id = auth.uid()
  OR
  -- Admins can see all (uses security definer function to avoid recursion)
  is_current_user_admin()
);

-- Step 4: Add update policy for admins
DROP POLICY IF EXISTS "Admins can update any user" ON "public"."users";
CREATE POLICY "Admins can update any user" ON "public"."users"
FOR UPDATE TO "authenticated"
USING (is_current_user_admin());

-- Step 5: Add delete policy for admins  
DROP POLICY IF EXISTS "Admins can delete any user" ON "public"."users";
CREATE POLICY "Admins can delete any user" ON "public"."users"
FOR DELETE TO "authenticated"
USING (is_current_user_admin());

