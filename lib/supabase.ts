'use client'

// Re-export from supabase-browser for compatibility
export { getSupabaseBrowserClient, createSupabaseBrowserClient } from './supabase-browser'

// For compatibility with the shop3 code that expects createClient
export { createClient } from './supabase/client'
