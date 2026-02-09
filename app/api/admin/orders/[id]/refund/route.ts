import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'
import { getAuthorizeNetConfig, refundTransaction, getTransactionDetails } from '@/lib/authorize-net'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const resolvedParams = await context.params
    const orderId = resolvedParams.id

    // Parse body
    const body = await request.json()
    const {
      refund_amount,
      refund_destination,
      customer_message,
      reason
    } = body

    console.log('[Refund] Processing refund for order:', orderId)

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, total_amount, authorize_net_transaction_id, customer_id, status, payment_status')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('[Refund] Order not found:', orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if already refunded
    if (order.status === 'refunded' || order.payment_status === 'refunded') {
      return NextResponse.json({ error: 'Order has already been refunded' }, { status: 400 })
    }

    // Calculate refund amount
    const amountToRefund = refund_amount || order.total_amount
    if (amountToRefund <= 0 || amountToRefund > order.total_amount) {
      return NextResponse.json({ error: 'Invalid refund amount' }, { status: 400 })
    }

    let refundTransId = null
    let refundId = null

    // Process Authorize.net refund if we have a transaction ID
    if (order.authorize_net_transaction_id && refund_destination === 'original_payment') {
      const config = getAuthorizeNetConfig()
      if (!config) {
        console.error('[Refund] Authorize.net is not configured')
        return NextResponse.json({ error: 'Payment service not configured' }, { status: 500 })
      }

      try {
        // Get transaction details to retrieve last 4 digits of card
        const txDetails = await getTransactionDetails(config, order.authorize_net_transaction_id)
        if (!txDetails.success || !txDetails.data) {
          console.error('[Refund] Could not retrieve transaction details:', txDetails.error)
          return NextResponse.json({ error: 'Could not retrieve original transaction details' }, { status: 400 })
        }

        // Get last 4 digits from the card number (format: XXXX1234)
        const lastFour = txDetails.data.accountNumber.slice(-4)

        // Process refund via Authorize.net
        const refundResult = await refundTransaction(
          config,
          order.authorize_net_transaction_id,
          amountToRefund,
          lastFour
        )

        if (!refundResult.success) {
          console.error('[Refund] Authorize.net error:', refundResult.error)

          // Update order with failed status
          await supabase
            .from('orders')
            .update({
              notes: `Refund failed: ${refundResult.error}`,
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId)

          // Try to add to timeline
          try {
            await supabase.from('refund_timeline').insert({
              order_id: orderId,
              status: 'failed',
              description: `Refund failed: ${refundResult.error}`,
              created_at: new Date().toISOString(),
            })
          } catch {
            // Timeline table may not exist yet
          }

          return NextResponse.json({
            error: refundResult.error || 'Refund failed',
          }, { status: 400 })
        }

        refundTransId = refundResult.refundTransId
        refundId = refundResult.refundTransId
        console.log('[Refund] Authorize.net refund created:', refundId)
      } catch (authNetError: any) {
        console.error('[Refund] Authorize.net error:', authNetError.message)

        // Update order with failed status
        await supabase
          .from('orders')
          .update({
            notes: `Refund failed: ${authNetError.message}`,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)

        try {
          await supabase.from('refund_timeline').insert({
            order_id: orderId,
            status: 'failed',
            description: `Refund failed: ${authNetError.message}`,
            created_at: new Date().toISOString(),
          })
        } catch {
          // Timeline table may not exist yet
        }

        return NextResponse.json({
          error: authNetError.message || 'Refund failed',
        }, { status: 400 })
      }
    }

    // Determine initial status based on destination
    // Authorize.net refunds are synchronous - if we got a refundTransId, it succeeded
    const initialStatus = refund_destination === 'original_payment'
      ? (refundTransId ? 'succeeded' : 'processing')
      : 'pending'

    // Update order with refund details - use basic columns first
    // These columns should always exist
    const basicUpdateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
      notes: `Refund ${initialStatus}: $${amountToRefund.toFixed(2)} via ${refund_destination}. ${reason || ''}`.trim(),
    }
    
    // Only update status fields if refund succeeded
    if (initialStatus === 'succeeded') {
      basicUpdateData.status = 'refunded'
      basicUpdateData.payment_status = 'refunded'
    }

    // First update with basic columns that definitely exist
    const { error: basicUpdateError } = await supabase
      .from('orders')
      .update(basicUpdateData)
      .eq('id', orderId)

    if (basicUpdateError) {
      console.error('[Refund] Error updating order (basic):', basicUpdateError)
      // Continue anyway since Stripe refund was successful
    }

    // Try to update with refund-specific columns (may fail if migration not run)
    const refundUpdateData: Record<string, any> = {
      refund_id: refundId,
      refund_amount: amountToRefund,
      refund_status: initialStatus,
      refund_destination,
      refund_customer_message: customer_message || null,
      refund_reason: reason || null,
      refund_initiated_at: new Date().toISOString(),
      refund_initiated_by: authResult.user?.id || null,
      refund_completed_at: initialStatus === 'succeeded' ? new Date().toISOString() : null,
    }

    const { error: refundUpdateError } = await supabase
      .from('orders')
      .update(refundUpdateData)
      .eq('id', orderId)

    if (refundUpdateError) {
      console.log('[Refund] Note: Could not update refund columns (migration may not be run yet):', refundUpdateError.message)
      // This is expected if migration hasn't been run - continue anyway
    }

    // Add timeline entry (may fail if migration not run)
    try {
      await supabase.from('refund_timeline').insert({
        order_id: orderId,
        status: 'initiated',
        description: `Refund of $${amountToRefund.toFixed(2)} initiated via ${refund_destination.replace('_', ' ')}`,
        created_at: new Date().toISOString(),
        metadata: {
          amount: amountToRefund,
          destination: refund_destination,
          initiated_by: authResult.user?.id,
        }
      })
    } catch {
      console.log('[Refund] Note: refund_timeline table may not exist')
    }

    // Add order tracking entry (may fail if table doesn't exist)
    try {
      await supabase.from('order_tracking').insert({
        order_id: orderId,
        status: 'refund_initiated',
        notes: `Refund of $${amountToRefund.toFixed(2)} initiated. ${reason || ''}`,
        created_at: new Date().toISOString(),
      })
    } catch {
      console.log('[Refund] Note: order_tracking table may not exist')
    }

    // If succeeded immediately, add completion timeline entry
    if (initialStatus === 'succeeded') {
      try {
        await supabase.from('refund_timeline').insert({
          order_id: orderId,
          status: 'succeeded',
          description: 'Refund completed successfully',
          created_at: new Date().toISOString(),
          metadata: {
            authorize_net_refund_id: refundId,
          }
        })
      } catch {
        console.log('[Refund] Note: refund_timeline table may not exist')
      }
    }

    // Get customer email for notification
    let customerEmail = null
    if (order.customer_id && customer_message) {
      const { data: customer } = await supabase
        .from('customers')
        .select('user_id')
        .eq('id', order.customer_id)
        .single()

      if (customer?.user_id) {
        const { data: user } = await supabase
          .from('users')
          .select('email')
          .eq('id', customer.user_id)
          .single()
        
        customerEmail = user?.email
      }
    }

    // Create notification for customer if message provided
    if (customer_message && order.customer_id) {
      try {
        await supabase.from('notifications').insert({
          customer_id: order.customer_id,
          order_id: orderId,
          type: 'refund',
          title: 'Refund Initiated',
          message: customer_message,
          is_read: false,
          created_at: new Date().toISOString(),
        })
      } catch {
        // Notifications table might not exist, ignore error
        console.log('[Refund] Could not create notification')
      }
    }

    console.log('[Refund] Refund processed successfully')

    return NextResponse.json({
      success: true,
      refund: {
        id: refundId,
        amount: amountToRefund,
        status: initialStatus,
        destination: refund_destination,
      }
    })

  } catch (error) {
    console.error('[Refund] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET endpoint to fetch refund timeline
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const resolvedParams = await context.params
    const orderId = resolvedParams.id

    // Get refund info from order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        refund_id,
        refund_amount,
        refund_status,
        refund_destination,
        refund_customer_message,
        refund_reason,
        refund_initiated_at,
        refund_completed_at,
        refund_initiated_by
      `)
      .eq('id', orderId)
      .single()

    if (orderError) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Get timeline entries
    const { data: timeline, error: timelineError } = await supabase
      .from('refund_timeline')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true })

    if (timelineError) {
      console.error('[Refund] Timeline error:', timelineError)
    }

    return NextResponse.json({
      refund: order,
      timeline: timeline || []
    })

  } catch (error) {
    console.error('[Refund] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

