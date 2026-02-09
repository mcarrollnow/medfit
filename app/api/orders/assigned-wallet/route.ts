import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number required' }, { status: 400 })
    }

    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, assigned_wallet_id')
      .eq('order_number', orderNumber)
      .single()

    if (orderError || !order) {
      console.error('Order error:', orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // If order has assigned wallet, fetch it
    if (order.assigned_wallet_id) {
      const { data: assignedWallet, error: walletError } = await supabase
        .from('business_wallets')
        .select('id, label, address, currency')
        .eq('id', order.assigned_wallet_id)
        .single()

      if (assignedWallet && !walletError) {
        return NextResponse.json({
          hasAssignedWallet: true,
          wallet: assignedWallet
        })
      }
    }

    // No wallet assigned, return default or first active wallet
    const { data: defaultWallet } = await supabase
      .from('business_wallets')
      .select('id, label, address, currency')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    return NextResponse.json({
      hasAssignedWallet: false,
      wallet: defaultWallet || null
    })

  } catch (error) {
    console.error('Error fetching assigned wallet:', error)
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 })
  }
}
