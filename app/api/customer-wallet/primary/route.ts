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
      return NextResponse.json({ 
        success: true, 
        wallet: null,
        message: 'No customer profile found'
      })
    }

    // Get primary wallet (or most recent if no primary set)
    const { data: wallet, error: walletError } = await supabase
      .from('customer_wallets')
      .select(`
        id,
        label,
        address,
        currency,
        is_primary,
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
      .limit(1)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ 
        success: true, 
        wallet: null,
        message: 'No wallet found'
      })
    }

    return NextResponse.json({
      success: true,
      wallet: {
        id: wallet.id,
        label: wallet.label,
        address: wallet.address,
        currency: wallet.currency,
        is_primary: wallet.is_primary,
        has_pin: !!wallet.pin_hash,
        has_password: !!wallet.password_hash,
        has_biometric: wallet.biometric_enabled,
        has_hardware_key: wallet.hardware_key_enabled,
        securityType: wallet.biometric_enabled 
          ? 'biometric' 
          : wallet.hardware_key_enabled 
            ? 'hardware_key'
            : wallet.pin_hash 
              ? 'pin' 
              : wallet.password_hash 
                ? 'password' 
                : 'none'
      }
    })

  } catch (error) {
    console.error('Error fetching primary wallet:', error)
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 })
  }
}

