'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Create a singleton instance for client components
// Store it on globalThis to survive Fast Refresh in development
let browserClient: ReturnType<typeof createSupabaseBrowserClient> | undefined

// In development, use globalThis to persist the client across Fast Refresh
if (typeof window !== 'undefined') {
  const globalWithSupabase = globalThis as typeof globalThis & {
    __supabaseClient?: ReturnType<typeof createSupabaseBrowserClient>
  }

  if (process.env.NODE_ENV === 'development') {
    // In development, store on globalThis to survive Fast Refresh
    if (!globalWithSupabase.__supabaseClient) {
      globalWithSupabase.__supabaseClient = createSupabaseBrowserClient()
    }
    browserClient = globalWithSupabase.__supabaseClient
  }
}

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient()
  }
  return browserClient
}