import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getEthPrice, usdToWei } from '@/lib/eth-price'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { orderId, walletId, currency } = await request.json()

    if (!orderId || !walletId || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log(`[Initiate Payment] Initiating payment for order ${orderId}`)

    // Get order with full details - use approved_amount or total_amount from DATABASE
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, total_amount, approved_amount, customer_id')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if user owns this order
    // First get the public user id from auth user
    const { data: publicUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!publicUser) {
      console.log(`[Initiate Payment] No public user found for auth_id: ${user.id}`)
      return NextResponse.json({ error: 'User profile not found' }, { status: 403 })
    }

    const { data: customer } = await supabase
      .from('customers')
      .select('user_id')
      .eq('id', order.customer_id)
      .single()

    if (!customer || customer.user_id !== publicUser.id) {
      console.log(`[Initiate Payment] Authorization failed - customer user_id: ${customer?.user_id}, public user_id: ${publicUser.id}, auth_id: ${user.id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Use approved_amount if set (admin approved), otherwise total_amount
    // This is the AUTHORITATIVE amount from database, not from client
    const amount = order.approved_amount || order.total_amount
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 })
    }
    
    console.log(`[Initiate Payment] Order amount from database: $${amount}`)

    // Get wallet address
    const { data: wallet, error: walletError } = await supabase
      .from('business_wallets')
      .select('id, address, label')
      .eq('id', walletId)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    let expectedPaymentAmount: string
    let paymentUrl: string
    let cryptoAmount: string
    let ethPrice: number | null = null
    let weiAmount: string | null = null

    if (currency === 'ETH') {
      // Get ETH price and convert amount to Wei
      ethPrice = await getEthPrice()
      
      if (!ethPrice || isNaN(ethPrice) || ethPrice <= 0) {
        console.error(`[Initiate Payment] Invalid ETH price: ${ethPrice}`)
        return NextResponse.json({ error: 'Failed to fetch current ETH price. Please try again.' }, { status: 500 })
      }
      
      weiAmount = usdToWei(amount, ethPrice)
      // ETH has 18 decimal places - use 5 decimal precision for display
      const ethAmount = amount / ethPrice
      cryptoAmount = ethAmount.toFixed(5) // 5 decimal precision for ETH
      expectedPaymentAmount = cryptoAmount
      paymentUrl = `ethereum:${wallet.address}@1?value=${weiAmount}`
      
      console.log(`[Initiate Payment] ETH Amount: $${amount} = ${cryptoAmount} ETH = ${weiAmount} Wei`)
    } else if (currency === 'USDC') {
      // USDC is 1:1 with USD, use the USD amount directly
      cryptoAmount = amount.toFixed(2) // 2 decimals for USDC
      expectedPaymentAmount = cryptoAmount
      // USDC uses ERC-20 transfer, not native ETH transfer
      const usdcContractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
      const amountInSmallestUnit = Math.round(amount * 1000000).toString() // USDC has 6 decimals
      paymentUrl = `ethereum:${usdcContractAddress}/transfer?address=${wallet.address}&uint256=${amountInSmallestUnit}`
      
      console.log(`[Initiate Payment] USDC Amount: $${amount} = ${cryptoAmount} USDC`)
    } else {
      return NextResponse.json({ error: `Unsupported currency: ${currency}` }, { status: 400 })
    }

    // Update order with payment tracking info
    // IMPORTANT: Store crypto amount, not USD amount, for payment verification
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'payment_processing',
        payment_method: currency.toLowerCase(),
        assigned_wallet_id: walletId,
        expected_payment_amount: expectedPaymentAmount, // Store crypto amount
        expected_payment_currency: currency,
        payment_initiated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order:', updateError)
      return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 })
    }

    console.log(`[Initiate Payment] Payment initiated for order ${orderId} to wallet ${wallet.label}`)

    const response: any = {
      success: true,
      walletAddress: wallet.address,
      amount: amount,
      currency: currency,
      orderId: orderId,
      paymentUrl: paymentUrl
    }

    // Add currency-specific fields
    if (currency === 'ETH') {
      response.ethAmount = cryptoAmount
      response.weiAmount = weiAmount
      response.ethPrice = ethPrice
    } else if (currency === 'USDC') {
      response.usdcAmount = cryptoAmount
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error initiating payment:', error)
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 })
  }
}
