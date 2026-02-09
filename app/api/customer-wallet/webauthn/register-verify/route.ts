import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase-server'

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

    const { walletId, credentialId, clientDataJSON, attestationObject, type } = await request.json()

    if (!walletId || !credentialId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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

    // Update the wallet with the security settings and credential
    const updateData: Record<string, any> = {}
    
    if (type === 'biometric') {
      updateData.biometric_enabled = true
      updateData.biometric_credential_id = credentialId
    } else if (type === 'hardware') {
      updateData.hardware_key_enabled = true
      updateData.hardware_key_credential_id = credentialId
    }

    const { error: walletError } = await supabase
      .from('customer_wallets')
      .update(updateData)
      .eq('id', walletId)
      .eq('customer_id', customer.id)

    if (walletError) {
      console.error('Error updating customer wallet:', walletError)
      return NextResponse.json({ error: 'Failed to update wallet security' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      credentialId 
    })
  } catch (error) {
    console.error('Customer WebAuthn register-verify error:', error)
    return NextResponse.json({ error: 'Failed to verify credential' }, { status: 500 })
  }
}

