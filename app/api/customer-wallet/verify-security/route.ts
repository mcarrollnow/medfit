import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/auth-server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = await createServerClient()
    // customers.user_id references public.users.id (profile id)
    const userId = authResult.user?.id
    const body = await request.json()
    const { walletId, pin, password } = body

    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID required' }, { status: 400 })
    }

    // Get customer by public.users.id
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (customerError || !customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Get wallet with security info
    const { data: wallet, error: walletError } = await supabase
      .from('customer_wallets')
      .select('id, pin_hash, password_hash, biometric_enabled, hardware_key_enabled')
      .eq('id', walletId)
      .eq('customer_id', customer.id)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    // Verify PIN if provided and wallet has PIN
    if (wallet.pin_hash && pin) {
      const isValidPin = await bcrypt.compare(pin, wallet.pin_hash)
      if (isValidPin) {
        return NextResponse.json({ 
          success: true, 
          verified: true,
          method: 'pin'
        })
      }
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
    }

    // Verify password if provided and wallet has password
    if (wallet.password_hash && password) {
      const isValidPassword = await bcrypt.compare(password, wallet.password_hash)
      if (isValidPassword) {
        return NextResponse.json({ 
          success: true, 
          verified: true,
          method: 'password'
        })
      }
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // If biometric is the only security and we got here, 
    // biometric should be verified client-side first via WebAuthn
    if (wallet.biometric_enabled || wallet.hardware_key_enabled) {
      return NextResponse.json({ 
        error: 'Biometric or hardware key verification required',
        requiresWebAuthn: true
      }, { status: 400 })
    }

    return NextResponse.json({ error: 'No valid security credentials provided' }, { status: 400 })

  } catch (error) {
    console.error('Error verifying wallet security:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}

