-- ============================================
-- FIX FOR RLS POLICY ERROR
-- ============================================
-- This fixes the "operator does not exist: uuid <@ ltree" error
-- Run this if you already ran the main schema and got an error

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view entries for their department and children" ON kpi_entries;

-- Recreate with correct type comparison (ltree <@ ltree, not uuid <@ ltree)
CREATE POLICY "Users can view entries for their department and children"
  ON kpi_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN departments user_dept ON up.department_id = user_dept.id
      JOIN department_kpis dk ON dk.id = kpi_entries.department_kpi_id
      JOIN departments kpi_dept ON dk.department_id = kpi_dept.id
      WHERE up.id = auth.uid()
      AND (kpi_dept.path <@ user_dept.path OR kpi_dept.id = user_dept.id)
    )
  );

-- Verify the policy was created
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'kpi_entries';
