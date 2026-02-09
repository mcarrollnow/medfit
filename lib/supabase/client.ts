import { getSupabaseBrowserClient } from '@/lib/supabase-browser'

export function createClient() {
  try {
    return getSupabaseBrowserClient()
  } catch (error) {
    console.warn('[v0] Supabase credentials not found. Using mock data mode.')
    return null
  }
}
