import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth-server'
import crypto from 'crypto'
import { siteConfig } from '@/lib/site-config'

// Get rpId based on request origin
function getRpId(request: NextRequest): string {
  const origin = request.headers.get('origin') || request.headers.get('host') || ''
  
  // For localhost development
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return 'localhost'
  }
  
  // Use environment variable or extract from origin
  if (process.env.WEBAUTHN_RP_ID) {
    return process.env.WEBAUTHN_RP_ID
  }
  
  // Extract domain from origin (remove protocol and port)
  const domain = origin.replace(/^https?:\/\//, '').split(':')[0]
  return domain || siteConfig.domain
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const { walletId } = await request.json()

    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID is required' }, { status: 400 })
    }

    // Get rpId based on current environment
    const rpId = getRpId(request)
    console.log('[WebAuthn Auth] Using rpId:', rpId)

    // Generate challenge
    const challenge = crypto.randomBytes(32)

    const options = {
      challenge: challenge.toString('base64'),
      rpId,
      timeout: 60000,
      userVerification: 'preferred',
      // Allow any credential - in production you'd filter by stored credentials
      allowCredentials: []
    }

    return NextResponse.json(options)
  } catch (error) {
    console.error('WebAuthn auth-options error:', error)
    return NextResponse.json({ error: 'Failed to generate options' }, { status: 500 })
  }
}

