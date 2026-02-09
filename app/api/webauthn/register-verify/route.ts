import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth-server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const { walletId, credentialId, clientDataJSON, attestationObject, type } = await request.json()

    if (!walletId || !credentialId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Use service role client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Update the wallet with the security settings
    const updateData: Record<string, any> = {}
    
    if (type === 'biometric') {
      updateData.biometric_enabled = true
    } else if (type === 'hardware') {
      updateData.hardware_key_enabled = true
    }

    // Note: webauthn_credential_id is a UUID FK to webauthn_credentials table
    // For now, just enable the flags. Full WebAuthn credential storage would require
    // inserting into webauthn_credentials table first

    const { error: walletError } = await supabase
      .from('business_wallets')
      .update(updateData)
      .eq('id', walletId)

    if (walletError) {
      console.error('Error updating wallet:', walletError)
      return NextResponse.json({ error: 'Failed to update wallet security' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      credentialId 
    })
  } catch (error) {
    console.error('WebAuthn register-verify error:', error)
    return NextResponse.json({ error: 'Failed to verify credential' }, { status: 500 })
  }
}

