import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = await createServerClient()
    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    console.log(`[Reset Payment] Attempting to reset payment for order ${orderId}`)

    // Get order with payment details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, customers!inner(user_id)')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Verify user owns this order
    if (order.customers.user_id !== authResult.user?.authId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // SAFETY CHECK: Don't reset if payment is already verified
    if (order.payment_status === 'paid' && order.transaction_hash) {
      console.log(`[Reset Payment] Cannot reset: Payment already verified with tx ${order.transaction_hash}`)
      return NextResponse.json({
        error: 'Cannot reset payment',
        reason: 'Payment has already been verified and completed',
        transactionHash: order.transaction_hash,
        canReset: false
      }, { status: 400 })
    }

    // SAFETY CHECK: Check transaction history before resetting
    if (order.assigned_wallet_id && order.expected_payment_amount && order.payment_initiated_at) {
      console.log(`[Reset Payment] Checking transaction history before reset...`)

      const { data: transactions, error: txError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', order.assigned_wallet_id)
        .eq('type', 'incoming')
        .eq('currency', order.expected_payment_currency)
        .gte('created_at', order.payment_initiated_at)
        .order('created_at', { ascending: false })

      if (!txError && transactions) {
        const expectedAmount = parseFloat(order.expected_payment_amount)
        const matchingTx = transactions.find(tx => {
          const txAmount = parseFloat(tx.amount)
          const difference = Math.abs(txAmount - expectedAmount)
          return difference < 0.0001
        })

        if (matchingTx && matchingTx.status === 'confirmed') {
          console.log(`[Reset Payment] Cannot reset: Found confirmed matching transaction ${matchingTx.tx_hash}`)
          
          // Update order to paid if it wasn't already
          await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              payment_date: matchingTx.created_at,
              payment_verified_at: new Date().toISOString(),
              transaction_hash: matchingTx.tx_hash
            })
            .eq('id', orderId)

          return NextResponse.json({
            error: 'Cannot reset payment',
            reason: 'Payment transaction found and verified on blockchain',
            transactionHash: matchingTx.tx_hash,
            canReset: false,
            autoVerified: true
          }, { status: 400 })
        }

        // Check for failed transactions (insufficient funds, etc.)
        const failedTx = transactions.find(tx => tx.status === 'failed')
        if (failedTx) {
          console.log(`[Reset Payment] Found failed transaction: ${failedTx.tx_hash}`)
          
          // Log the failure reason
          await supabase
            .from('orders')
            .update({
              payment_failed_reason: `Transaction failed on blockchain: ${failedTx.tx_hash}. Likely insufficient funds.`
            })
            .eq('id', orderId)
        }
      }
    }

    // Safe to reset - no confirmed payment found
    console.log(`[Reset Payment] Safe to reset payment for order ${orderId}`)

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'pending',
        payment_initiated_at: null,
        payment_verified_at: null,
        // Keep these for audit trail:
        // - transaction_hash (if any)
        // - payment_failed_reason (if any)
        // - assigned_wallet_id (keep the wallet assignment)
        // - expected_payment_amount (keep for reference)
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error resetting payment:', updateError)
      return NextResponse.json({ error: 'Failed to reset payment' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Payment reset successfully. You can try again.',
      newStatus: 'pending',
      canReset: true
    })

  } catch (error) {
    console.error('Error resetting payment:', error)
    return NextResponse.json({ error: 'Failed to reset payment' }, { status: 500 })
  }
}
