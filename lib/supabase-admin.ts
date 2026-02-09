import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Admin client with service role key for privileged operations
let adminClient: SupabaseClient | null = null

export function getSupabaseAdminClient(): SupabaseClient | null {
  // Return cached client if exists
  if (adminClient) {
    return adminClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[Admin Client] Missing credentials:', {
      url: !!supabaseUrl,
      key: !!serviceRoleKey
    })
    return null
  }

  adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return adminClient
}
