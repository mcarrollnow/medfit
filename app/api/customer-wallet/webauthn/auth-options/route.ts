import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/auth-server'
import crypto from 'crypto'
import { siteConfig } from '@/lib/site-config'

// Get rpId based on request origin - must match what was used during registration
function getRpId(request: NextRequest): string {
  const origin = request.headers.get('origin') || ''
  const host = request.headers.get('host') || ''
  
  // Local development
  if (origin.includes('localhost') || origin.includes('127.0.0.1') || host.includes('localhost')) {
    return 'localhost'
  }
  
  // Environment variable override
  if (process.env.WEBAUTHN_RP_ID) {
    return process.env.WEBAUTHN_RP_ID
  }
  
  // Production domain
  if (origin.includes(siteConfig.domain) || host.includes(siteConfig.domain)) {
    return siteConfig.domain
  }
  
  // Vercel preview deployments
  if (host.includes('vercel.app')) {
    return host.split(':')[0]
  }
  
  // Fallback
  const domain = origin.replace(/^https?:\/\//, '').split(':')[0] || host.split(':')[0]
  return domain || siteConfig.domain
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = await createServerClient()
    const userId = authResult.user?.id
    const body = await request.json()
    const { walletId } = body

    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID required' }, { status: 400 })
    }

    // Get customer record
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (customerError || !customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Get wallet with credential info
    const { data: wallet, error: walletError } = await supabase
      .from('customer_wallets')
      .select(`
        id,
        biometric_enabled,
        biometric_credential_id,
        hardware_key_enabled,
        hardware_key_credential_id
      `)
      .eq('id', walletId)
      .eq('customer_id', customer.id)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    // Check if wallet has WebAuthn enabled
    if (!wallet.biometric_enabled && !wallet.hardware_key_enabled) {
      return NextResponse.json({ error: 'WebAuthn not enabled for this wallet' }, { status: 400 })
    }

    // Get credential ID
    const credentialId = wallet.biometric_credential_id || wallet.hardware_key_credential_id
    if (!credentialId) {
      return NextResponse.json({ error: 'No WebAuthn credentials registered' }, { status: 400 })
    }

    // Generate challenge
    const challenge = crypto.randomBytes(32).toString('base64')

    // Store challenge temporarily (in production, use Redis or similar)
    // For now, we'll rely on the stateless verification
    
    const rpId = getRpId(request)
    console.log('[WebAuthn Auth] Using rpId:', rpId)
    
    return NextResponse.json({
      success: true,
      challenge,
      rpId,
      allowCredentials: [{
        id: credentialId,
        type: 'public-key'
      }],
      timeout: 60000,
      userVerification: 'required'
    })

  } catch (error) {
    console.error('Error generating WebAuthn auth options:', error)
    return NextResponse.json({ error: 'Failed to generate auth options' }, { status: 500 })
  }
}

