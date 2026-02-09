-- Reload PostgREST schema cache
-- Run this EVERY TIME after making database schema changes

-- Signal PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';

-- Alternative method if NOTIFY doesn't work:
-- This forces a schema cache reload by updating the schema version
-- (Supabase automatically picks this up)
SELECT pg_notify('pgrst', 'reload schema');
