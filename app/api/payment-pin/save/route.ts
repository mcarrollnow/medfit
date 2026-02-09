import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { token, pin, customerEmail } = await request.json()

    if (!token || !pin || !customerEmail) {
      return NextResponse.json(
        { error: 'Token, PIN, and email are required' },
        { status: 400 }
      )
    }

    // Find customer by token
    const { data: customer, error: fetchError } = await supabase
      .from('customer_payment_pins')
      .select('*')
      .eq('setup_token', token)
      .eq('customer_email', customerEmail)
      .single()

    if (fetchError || !customer) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Check if token is expired
    const tokenExpiry = new Date(customer.token_expires_at)
    if (tokenExpiry < new Date()) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 401 }
      )
    }

    // Save PIN and clear token
    const { error: updateError } = await supabase
      .from('customer_payment_pins')
      .update({
        pin: pin,
        pin_created_at: new Date().toISOString(),
        setup_token: null,
        token_expires_at: null,
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', customer.id)

    if (updateError) {
      console.error('Error saving PIN:', updateError)
      return NextResponse.json(
        { error: 'Failed to save PIN' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'PIN created successfully'
    }, { status: 200 })

  } catch (error) {
    console.error('Error in save PIN route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
