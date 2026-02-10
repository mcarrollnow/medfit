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

    const { walletId, authenticatorType = 'cross-platform' } = await request.json()

    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID is required' }, { status: 400 })
    }

    // Get rpId based on current environment
    const rpId = getRpId(request)
    console.log('[WebAuthn Register] Using rpId:', rpId)

    // Generate challenge
    const challenge = crypto.randomBytes(32)
    
    // Generate user ID from wallet ID
    const userId = crypto.createHash('sha256').update(walletId).digest()

    // Store challenge temporarily (in production, use Redis or database)
    // For now we'll verify it client-side
    
    const options = {
      challenge: challenge.toString('base64'),
      rp: {
        name: 'Medfit 90',
        id: rpId
      },
      user: {
        id: userId.toString('base64'),
        name: `wallet-${walletId.slice(0, 8)}`,
        displayName: 'Wallet Security Key'
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },   // ES256
        { type: 'public-key', alg: -257 }  // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: authenticatorType, // 'platform' for biometric, 'cross-platform' for hardware key
        userVerification: 'preferred',
        residentKey: 'preferred'
      },
      timeout: 60000,
      attestation: 'none'
    }

    return NextResponse.json(options)
  } catch (error) {
    console.error('WebAuthn register-options error:', error)
    return NextResponse.json({ error: 'Failed to generate options' }, { status: 500 })
  }
}

