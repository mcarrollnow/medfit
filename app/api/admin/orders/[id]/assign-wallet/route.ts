import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'
import { getEthPrice, usdToWei } from '@/lib/eth-price'

// GET - Get assigned wallet for order (or assign one if none exists)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Get order with assigned wallet
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id, 
        order_number, 
        total_amount,
        assigned_wallet_id,
        expected_payment_currency,
        expected_payment_amount
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // If order has assigned wallet, fetch it
    if (order.assigned_wallet_id) {
      const { data: wallet, error: walletError } = await supabase
        .from('business_wallets')
        .select('id, label, address, currency')
        .eq('id', order.assigned_wallet_id)
        .single()

      if (wallet && !walletError) {
        return NextResponse.json({
          hasAssignedWallet: true,
          wallet,
          order: {
            id: order.id,
            order_number: order.order_number,
            total_amount: order.total_amount,
            expected_currency: order.expected_payment_currency,
            expected_amount: order.expected_payment_amount
          }
        })
      }
    }

    // No wallet assigned - get default or first active wallet
    const { data: defaultWallet, error: defaultError } = await supabase
      .from('business_wallets')
      .select('id, label, address, currency')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    if (defaultError || !defaultWallet) {
      return NextResponse.json({
        hasAssignedWallet: false,
        wallet: null,
        error: 'No active business wallets available'
      })
    }

    // Auto-assign this wallet to the order
    await supabase
      .from('orders')
      .update({ assigned_wallet_id: defaultWallet.id })
      .eq('id', orderId)

    return NextResponse.json({
      hasAssignedWallet: true,
      wallet: defaultWallet,
      autoAssigned: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount
      }
    })

  } catch (error) {
    console.error('[Assign Wallet GET] Error:', error)
    return NextResponse.json({ error: 'Failed to get wallet' }, { status: 500 })
  }
}

// POST - Initiate crypto payment with currency selection
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { currency = 'ETH' } = await request.json()

    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, total_amount, assigned_wallet_id')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Get or assign wallet
    let walletId = order.assigned_wallet_id
    if (!walletId) {
      const { data: defaultWallet } = await supabase
        .from('business_wallets')
        .select('id')
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .single()

      if (!defaultWallet) {
        return NextResponse.json({ error: 'No active business wallets available' }, { status: 400 })
      }
      walletId = defaultWallet.id
    }

    // Get wallet details
    const { data: wallet, error: walletError } = await supabase
      .from('business_wallets')
      .select('id, address, label, currency')
      .eq('id', walletId)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    const amount = order.total_amount
    let cryptoAmount: string
    let paymentUrl: string
    let ethPrice: number | null = null
    let weiAmount: string | null = null

    if (currency === 'ETH') {
      // Get ETH price and convert
      ethPrice = await getEthPrice()
      
      if (!ethPrice || isNaN(ethPrice) || ethPrice <= 0) {
        return NextResponse.json({ error: 'Failed to fetch ETH price' }, { status: 500 })
      }
      
      weiAmount = usdToWei(amount, ethPrice)
      const ethAmount = amount / ethPrice
      cryptoAmount = ethAmount.toFixed(5)
      paymentUrl = `ethereum:${wallet.address}@1?value=${weiAmount}`
      
    } else if (currency === 'USDC') {
      cryptoAmount = amount.toFixed(2)
      const usdcContractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
      const amountInSmallestUnit = Math.round(amount * 1000000).toString()
      paymentUrl = `ethereum:${usdcContractAddress}/transfer?address=${wallet.address}&uint256=${amountInSmallestUnit}`
    } else {
      return NextResponse.json({ error: `Unsupported currency: ${currency}` }, { status: 400 })
    }

    // Update order with payment info
    await supabase
      .from('orders')
      .update({
        payment_status: 'payment_processing',
        payment_method: currency.toLowerCase(),
        assigned_wallet_id: walletId,
        expected_payment_amount: cryptoAmount,
        expected_payment_currency: currency,
        payment_initiated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    return NextResponse.json({
      success: true,
      wallet: {
        id: wallet.id,
        address: wallet.address,
        label: wallet.label
      },
      payment: {
        currency,
        usdAmount: amount,
        cryptoAmount,
        paymentUrl,
        ...(currency === 'ETH' && { ethPrice, weiAmount })
      }
    })

  } catch (error) {
    console.error('[Assign Wallet POST] Error:', error)
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 })
  }
}

