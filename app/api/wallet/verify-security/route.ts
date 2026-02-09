import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth-server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const body = await request.json()
    const { walletId, pin, password } = body

    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID required' }, { status: 400 })
    }

    // Use service role client
    const { createClient } = await import('@supabase/supabase-js')
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

    // Get wallet security settings
    const { data: wallet, error } = await supabase
      .from('business_wallets')
      .select('id, pin_hash, password_hash, biometric_enabled, hardware_key_enabled')
      .eq('id', walletId)
      .eq('is_active', true)
      .single()

    if (error || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    const securityRequired = {
      pin: !!wallet.pin_hash,
      password: !!wallet.password_hash,
      biometric: wallet.biometric_enabled,
      hardwareKey: wallet.hardware_key_enabled
    }

    // If no security required, return success
    if (!securityRequired.pin && !securityRequired.password) {
      return NextResponse.json({
        success: true,
        verified: true,
        securityRequired
      })
    }

    let verified = true

    // Verify PIN if required
    if (securityRequired.pin) {
      if (!pin) {
        return NextResponse.json({
          success: false,
          verified: false,
          error: 'PIN required',
          securityRequired
        })
      }
      
      const pinValid = await bcrypt.compare(pin, wallet.pin_hash)
      if (!pinValid) {
        return NextResponse.json({
          success: false,
          verified: false,
          error: 'Invalid PIN',
          securityRequired
        })
      }
    }

    // Verify password if required
    if (securityRequired.password) {
      if (!password) {
        return NextResponse.json({
          success: false,
          verified: false,
          error: 'Password required',
          securityRequired
        })
      }
      
      const passwordValid = await bcrypt.compare(password, wallet.password_hash)
      if (!passwordValid) {
        return NextResponse.json({
          success: false,
          verified: false,
          error: 'Invalid password',
          securityRequired
        })
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      securityRequired
    })

  } catch (error) {
    console.error('Error verifying wallet security:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}

