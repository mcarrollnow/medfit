import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAuth } from '@/lib/auth-server'

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(req)
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get user data from users table using auth_id (use authId, not id)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, phone')
      .eq('auth_id', authResult.user.authId)
      .single()

    if (userError || !user) {
      // Return what we have from auth
      return NextResponse.json({
        first_name: authResult.user.firstName || '',
        last_name: authResult.user.lastName || '',
        email: authResult.user.email || '',
        phone: '',
        customer_type: 'retail',
        company_name: ''
      })
    }

    // Get customer data if exists
    const { data: customer } = await supabase
      .from('customers')
      .select('customer_type, company_name')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      customer_type: customer?.customer_type || 'retail',
      company_name: customer?.company_name || ''
    })

  } catch (error: any) {
    console.error('[Customer Profile] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

