import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

// Generate a unique random referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excluded I, O, 0, 1 to avoid confusion
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST() {
  try {
    console.log('[Ensure User API] Starting...')
    
    const supabase = await createServerClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('[Ensure User API] No authenticated user')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    console.log('[Ensure User API] Auth user:', user.id, user.email)
    
    // First, try with regular client (might work if RLS is set up properly)
    let { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()
    
    if (existingUser) {
      console.log('[Ensure User API] User already exists:', existingUser.id)
      return NextResponse.json({ userId: existingUser.id, created: false })
    }
    
    // If not found, try to create with admin client
    console.log('[Ensure User API] User not found, creating...')
    
    try {
      const adminClient = getSupabaseAdminClient()
      
      // Create user record
      const { data: newUser, error: createError } = await adminClient
        .from('users')
        .insert({
          auth_id: user.id,
          email: user.email || '',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          role: 'customer',
          created_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (createError) {
        console.error('[Ensure User API] Create error:', createError)
        
        // If unique constraint, try to fetch again
        if (createError.code === '23505') {
          const { data: retryUser } = await adminClient
            .from('users')
            .select('id')
            .eq('auth_id', user.id)
            .single()
          
          if (retryUser) {
            return NextResponse.json({ userId: retryUser.id, created: false })
          }
        }
        
        throw createError
      }
      
      console.log('[Ensure User API] User created:', newUser.id)
      
      // Also create customer record with referral code
      const referralCode = generateReferralCode();
      
      await adminClient
        .from('customers')
        .insert({
          user_id: newUser.id,
          customer_type: 'retail',
          referral_code: referralCode,
          created_at: new Date().toISOString()
        })
        .single()
      
      console.log('[Ensure User API] Customer created with referral code:', referralCode)
      
      return NextResponse.json({ userId: newUser.id, created: true })
      
    } catch (adminError: any) {
      console.error('[Ensure User API] Admin client error:', adminError)
      
      // If admin client fails, try with regular client (some Supabase setups allow this)
      const { data: fallbackUser, error: fallbackError } = await supabase
        .from('users')
        .insert({
          auth_id: user.id,
          email: user.email || '',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          role: 'customer',
          created_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (fallbackError) {
        console.error('[Ensure User API] Fallback error:', fallbackError)
        return NextResponse.json({ 
          error: 'Failed to create user record',
          details: fallbackError.message 
        }, { status: 500 })
      }
      
      return NextResponse.json({ userId: fallbackUser.id, created: true })
    }
    
  } catch (error: any) {
    console.error('[Ensure User API] Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error?.message 
    }, { status: 500 })
  }
}
