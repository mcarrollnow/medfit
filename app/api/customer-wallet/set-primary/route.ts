import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/auth-utils'

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
      return NextResponse.json({ error: 'Wallet ID is required' }, { status: 400 })
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

    // Verify the wallet belongs to this customer
    const { data: wallet, error: walletError } = await supabase
      .from('customer_wallets')
      .select('id')
      .eq('id', walletId)
      .eq('customer_id', customer.id)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    // First, unset all other wallets as primary for this customer
    const { error: unsetError } = await supabase
      .from('customer_wallets')
      .update({ is_primary: false })
      .eq('customer_id', customer.id)

    if (unsetError) {
      console.error('Error unsetting primary wallets:', unsetError)
      return NextResponse.json({ error: 'Failed to update wallets' }, { status: 500 })
    }

    // Set the specified wallet as primary
    const { error: setError } = await supabase
      .from('customer_wallets')
      .update({ is_primary: true })
      .eq('id', walletId)

    if (setError) {
      console.error('Error setting primary wallet:', setError)
      return NextResponse.json({ error: 'Failed to set primary wallet' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Primary wallet updated successfully'
    })

  } catch (error: any) {
    console.error('Error setting primary wallet:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

