import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase-server'
import crypto from 'crypto'
import { siteConfig } from '@/lib/site-config'

// Get rpId based on request origin
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
  
  // Production domain - extract from origin or host
  if (origin.includes(siteConfig.domain) || host.includes(siteConfig.domain)) {
    return siteConfig.domain
  }
  
  // Vercel preview deployments
  if (host.includes('vercel.app')) {
    return host.split(':')[0]
  }
  
  // Fallback: extract domain from origin or host
  const domain = origin.replace(/^https?:\/\//, '').split(':')[0] || host.split(':')[0]
  return domain || siteConfig.domain
}

export async function POST(request: NextRequest) {
  try {
    // Verify customer authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = await createServerClient()
    const userId = authResult.user?.id

    // Get customer record
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const { walletId, authenticatorType = 'platform' } = await request.json()

    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID is required' }, { status: 400 })
    }

    // Verify wallet belongs to customer
    const { data: wallet } = await supabase
      .from('customer_wallets')
      .select('id')
      .eq('id', walletId)
      .eq('customer_id', customer.id)
      .single()

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    const rpId = getRpId(request)
    console.log('[WebAuthn Register] rpId:', rpId, 'origin:', request.headers.get('origin'), 'host:', request.headers.get('host'))
    
    const challenge = crypto.randomBytes(32)
    const userIdHash = crypto.createHash('sha256').update(walletId).digest()

    const options = {
      challenge: challenge.toString('base64'),
      rp: {
        name: 'Modern Health Pro',
        id: rpId
      },
      user: {
        id: userIdHash.toString('base64'),
        name: `wallet-${walletId.slice(0, 8)}`,
        displayName: 'Wallet Security'
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 }
      ],
      authenticatorSelection: {
        authenticatorAttachment: authenticatorType,
        userVerification: 'preferred',
        residentKey: 'preferred'
      },
      timeout: 60000,
      attestation: 'none'
    }

    return NextResponse.json(options)
  } catch (error) {
    console.error('Customer WebAuthn register-options error:', error)
    return NextResponse.json({ error: 'Failed to generate options' }, { status: 500 })
  }
}

