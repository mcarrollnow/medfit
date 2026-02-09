import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

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

    // Parse request body
    const body = await request.json()
    const { payment_method, stripe_payment_intent_id, invoice_id, payment_link_url } = body

    // Log without payment provider identifiers
    if (process.env.NODE_ENV === 'development') {
      console.log('[Capture Payment] Processing order:', orderId, 'method:', payment_method)
    }

    // For invoice and payment_link, the payment is not captured yet - it's pending customer action
    const isPendingPayment = payment_method === 'invoice' || payment_method === 'payment_link'

    // Get the current order
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, order_number, payment_status, status, notes')
      .eq('id', orderId)
      .single()

    if (fetchError || !order) {
      console.error('[Capture Payment] Order not found:', fetchError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if already paid (unless we're just recording an invoice/link was sent)
    if (order.payment_status === 'paid' && !isPendingPayment) {
      return NextResponse.json({ error: 'Order is already paid' }, { status: 400 })
    }

    // Build updated notes
    let updatedNotes = order.notes || ''
    if (isPendingPayment) {
      const timestamp = new Date().toLocaleString()
      if (payment_method === 'invoice') {
        updatedNotes += updatedNotes ? ` | [Invoice Sent: ${timestamp}]` : `[Invoice Sent: ${timestamp}]`
      } else if (payment_method === 'payment_link') {
        updatedNotes += updatedNotes ? ` | [Payment Link Sent: ${timestamp}]` : `[Payment Link Sent: ${timestamp}]`
      }
    } else {
      updatedNotes += updatedNotes 
        ? ` | [Payment Captured: ${payment_method.toUpperCase()}]`
        : `[Payment Captured: ${payment_method.toUpperCase()}]`
    }

    // Determine payment status based on method
    const newPaymentStatus = isPendingPayment ? 'pending' : 'paid'
    const newOrderStatus = isPendingPayment 
      ? order.status  // Keep existing status for pending payments
      : (order.status === 'pending' ? 'processing' : order.status)

    // Update order with payment info
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: newPaymentStatus,
        payment_method: payment_method || 'other',
        payment_date: isPendingPayment ? null : new Date().toISOString(),
        status: newOrderStatus,
        notes: updatedNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (updateError) {
      console.error('[Capture Payment] Error updating order:', updateError)
      return NextResponse.json({ error: 'Failed to capture payment', details: updateError.message }, { status: 500 })
    }

    console.log('[Capture Payment] Payment captured successfully for order:', order.order_number)

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: `Payment captured for order ${order.order_number}`
    })

  } catch (error) {
    console.error('[Capture Payment] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

