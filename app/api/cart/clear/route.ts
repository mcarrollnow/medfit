import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST() {
  try {
    const supabase = await createServerClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get user record from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Clear all cart items for the user
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userData.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Cart API] Error clearing cart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
