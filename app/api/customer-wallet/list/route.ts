import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = await createServerClient()
    // customers.user_id references public.users.id (profile id)
    const userId = authResult.user?.id

    // Get customer by public.users.id
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (customerError || !customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Get customer's wallets
    const { data: wallets, error: walletsError } = await supabase
      .from('customer_wallets')
      .select(`
        id,
        label,
        address,
        currency,
        is_primary,
        is_active,
        biometric_enabled,
        hardware_key_enabled,
        pin_hash,
        password_hash,
        created_at
      `)
      .eq('customer_id', customer.id)
      .eq('is_active', true)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: false })

    if (walletsError) {
      console.error('Error fetching customer wallets:', walletsError)
      return NextResponse.json({ error: 'Failed to fetch wallets' }, { status: 500 })
    }

    // Add security info (without exposing hashes)
    const walletsWithSecurityInfo = wallets?.map(wallet => ({
      id: wallet.id,
      label: wallet.label,
      address: wallet.address,
      currency: wallet.currency,
      is_primary: wallet.is_primary,
      is_active: wallet.is_active,
      created_at: wallet.created_at,
      has_pin: !!wallet.pin_hash,
      has_password: !!wallet.password_hash,
      has_biometric: wallet.biometric_enabled,
      has_hardware_key: wallet.hardware_key_enabled
    })) || []

    return NextResponse.json({
      success: true,
      wallets: walletsWithSecurityInfo
    })

  } catch (error) {
    console.error('Error fetching customer wallets:', error)
    return NextResponse.json({ error: 'Failed to fetch wallets' }, { status: 500 })
  }
}
