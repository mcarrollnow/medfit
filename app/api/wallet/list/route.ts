import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAdmin } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = await createServerClient()

    // Get all business wallets (without private keys)
    const { data: wallets, error: walletsError } = await supabase
      .from('business_wallets')
      .select('id, label, address, currency, is_active, created_at, balance_eth, balance_usdc, pin_hash, password_hash, webauthn_credential_id, biometric_enabled, hardware_key_enabled')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (walletsError) {
      console.error('Error fetching wallets:', walletsError)
      return NextResponse.json({ error: 'Failed to fetch wallets' }, { status: 500 })
    }

    // Transform wallets to include security status booleans
    const transformedWallets = (wallets || []).map((wallet: any) => ({
      id: wallet.id,
      label: wallet.label,
      address: wallet.address,
      currency: wallet.currency,
      is_active: wallet.is_active,
      created_at: wallet.created_at,
      balance_eth: wallet.balance_eth,
      balance_usdc: wallet.balance_usdc,
      has_pin: !!wallet.pin_hash,
      has_password: !!wallet.password_hash,
      has_webauthn: !!wallet.webauthn_credential_id,
      biometric_enabled: !!wallet.biometric_enabled,
      hardware_key_enabled: !!wallet.hardware_key_enabled,
    }))

    return NextResponse.json({
      success: true,
      wallets: transformedWallets
    })

  } catch (error) {
    console.error('Error listing wallets:', error)
    return NextResponse.json({ error: 'Failed to list wallets' }, { status: 500 })
  }
}
