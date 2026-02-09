import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { 
  getAuthorizeNetConfig, 
  verifyWebhookSignature,
  getTransactionDetails,
  getStatusFromEventType
} from '@/lib/authorize-net'
import { createShippingLabelJob } from '@/lib/print-job-helpers'

export async function POST(request: NextRequest) {
  try {
    const config = getAuthorizeNetConfig()
    
    if (!config) {
      console.error('[Authorize.net Webhook] API credentials not configured')
      return NextResponse.json({ error: 'Not configured' }, { status: 500 })
    }

    const body = await request.text()
    const signature = request.headers.get('x-anet-signature')

    // Verify webhook signature if signature key is configured
    if (config.signatureKey && signature) {
      const signatureValue = signature.replace('sha512=', '')
      const isValid = verifyWebhookSignature(config.signatureKey, body, signatureValue)
      
      if (!isValid) {
        console.error('[Authorize.net Webhook] Invalid signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const payload = JSON.parse(body)
    console.log(`[Authorize.net Webhook] Received event: ${payload.eventType}`)

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      console.error('[Authorize.net Webhook] Failed to get admin client')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Get transaction ID from payload
    const transactionId = payload.payload?.id
    if (!transactionId) {
      console.log('[Authorize.net Webhook] No transaction ID in payload')
      return NextResponse.json({ received: true })
    }

    // Get full transaction details
    const txDetails = await getTransactionDetails(config, transactionId)
    
    // Determine status from event type
    const status = getStatusFromEventType(payload.eventType)

    // Log the payment event
    await logPaymentEvent(
      supabase,
      payload,
      transactionId,
      status,
      txDetails.data
    )

    // Handle specific event types
    switch (payload.eventType) {
      case 'net.authorize.payment.authcapture.created':
        await handlePaymentSuccess(supabase, transactionId, txDetails.data)
        break

      case 'net.authorize.payment.refund.created':
        await handleRefund(supabase, transactionId, txDetails.data)
        break

      case 'net.authorize.payment.void.created':
        await handleVoid(supabase, transactionId)
        break

      case 'net.authorize.payment.fraud.declined':
        await handleDeclined(supabase, transactionId, 'fraud')
        break

      default:
        console.log(`[Authorize.net Webhook] Unhandled event type: ${payload.eventType}`)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('[Authorize.net Webhook] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Helper to find order by transaction ID or invoice number (order_number)
async function findOrderByTransaction(
  supabase: any,
  transactionId: string,
  txDetails?: any
): Promise<{ id: string; order_number: string } | null> {
  // First try by transaction ID (for subsequent events on same transaction)
  let { data: order } = await supabase
    .from('orders')
    .select('id, order_number')
    .eq('authorize_net_transaction_id', transactionId)
    .maybeSingle()

  if (order) return order

  // Try by invoice number from transaction details (this is our order_number)
  // Authorize.net returns this in the transaction details as order.invoiceNumber
  const invoiceNumber = txDetails?.order?.invoiceNumber
  if (invoiceNumber) {
    console.log(`[Authorize.net Webhook] Looking up order by invoiceNumber: ${invoiceNumber}`)
    const { data: orderByInvoice } = await supabase
      .from('orders')
      .select('id, order_number')
      .eq('order_number', invoiceNumber)
      .maybeSingle()
    
    if (orderByInvoice) return orderByInvoice
  }

  return null
}

// Log payment event to database
async function logPaymentEvent(
  supabase: any,
  webhook: any,
  transactionId: string,
  status: string,
  txDetails?: any
) {
  // Find the order
  const order = await findOrderByTransaction(supabase, transactionId, txDetails)

  const { error } = await supabase
    .from('payment_events')
    .insert({
      order_id: order?.id || null,
      provider: 'authorize_net',
      event_id: webhook.notificationId,
      transaction_id: transactionId,
      event_type: webhook.eventType,
      status,
      amount: txDetails?.amount ? Math.round(txDetails.amount * 100) : webhook.payload?.authAmount ? Math.round(webhook.payload.authAmount * 100) : null,
      currency: 'usd',
      payment_method_type: 'card',
      payment_method_last4: txDetails?.accountNumber?.slice(-4) || null,
      payment_method_brand: txDetails?.accountType || null,
      auth_code: txDetails?.authCode || webhook.payload?.authCode || null,
      avs_result: txDetails?.avsResultCode || webhook.payload?.avsResponse || null,
      raw_event: webhook,
      event_timestamp: webhook.eventDate ? new Date(webhook.eventDate).toISOString() : new Date().toISOString(),
    })

  if (error) {
    console.error('[Authorize.net Webhook] Error logging payment event:', error)
  }
}

// Handle successful payment
async function handlePaymentSuccess(
  supabase: any,
  transactionId: string,
  txDetails?: any
) {
  console.log(`[Authorize.net Webhook] Payment succeeded: ${transactionId}`)

  // Find order by transaction ID or invoice number
  const order = await findOrderByTransaction(supabase, transactionId, txDetails)

  if (order) {
    const now = new Date().toISOString()
    const last4 = txDetails?.accountNumber?.slice(-4) || null
    const cardBrand = txDetails?.accountType || null
    
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_status: 'paid',
        payment_date: now,
        paid_at: now,
        // Store transaction ID for future lookups (refunds, etc.)
        authorize_net_transaction_id: transactionId,
        // Set payment method fields for easy querying
        payment_method: 'card',
        payment_provider: 'authorize_net',
        // Card-specific fields (PCI compliant - only last 4)
        card_brand: cardBrand,
        card_last_four: last4,
        // Also store in JSONB for backwards compatibility
        payment_method_details: {
          type: 'card',
          last4: last4,
          brand: cardBrand,
          authCode: txDetails?.authCode || null,
          avsResult: txDetails?.avsResultCode || null,
          transactionId: transactionId,
        },
        payment_failure_reason: null,
        payment_failed_at: null,
        updated_at: now,
      })
      .eq('id', order.id)

    if (updateError) {
      console.error('[Authorize.net Webhook] Error updating order:', updateError)
    } else {
      console.log(`[Authorize.net Webhook] Updated order ${order.order_number} to PAID via ${cardBrand || 'card'} ****${last4 || '????'}`)
      
      // Create shipping label print job
      try {
        const printResult = await createShippingLabelJob(order.id)
        if (printResult.success) {
          console.log(`[Authorize.net Webhook] Shipping label queued for order ${order.order_number}`)
        } else {
          console.log(`[Authorize.net Webhook] Could not create label: ${printResult.error}`)
        }
      } catch (printError) {
        console.error('[Authorize.net Webhook] Error creating print job:', printError)
      }
    }
  } else {
    console.log(`[Authorize.net Webhook] No order found for transaction ${transactionId}`)
  }
}

// Handle refund
async function handleRefund(
  supabase: any,
  transactionId: string,
  txDetails?: any
) {
  console.log(`[Authorize.net Webhook] Refund processed: ${transactionId}`)

  const { data: order } = await supabase
    .from('orders')
    .select('id, order_number')
    .eq('authorize_net_transaction_id', transactionId)
    .maybeSingle()

  if (order) {
    await supabase
      .from('orders')
      .update({
        payment_status: 'refunded',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)
    
    console.log(`[Authorize.net Webhook] Updated order ${order.order_number} to REFUNDED`)
  }
}

// Handle void
async function handleVoid(supabase: any, transactionId: string) {
  console.log(`[Authorize.net Webhook] Transaction voided: ${transactionId}`)

  const { data: order } = await supabase
    .from('orders')
    .select('id, order_number')
    .eq('authorize_net_transaction_id', transactionId)
    .maybeSingle()

  if (order) {
    await supabase
      .from('orders')
      .update({
        payment_status: 'voided',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)
    
    console.log(`[Authorize.net Webhook] Updated order ${order.order_number} to VOIDED`)
  }
}

// Handle declined
async function handleDeclined(supabase: any, transactionId: string, reason: string) {
  console.log(`[Authorize.net Webhook] Transaction declined: ${transactionId}`)

  const { data: order } = await supabase
    .from('orders')
    .select('id, order_number')
    .eq('authorize_net_transaction_id', transactionId)
    .maybeSingle()

  if (order) {
    await supabase
      .from('orders')
      .update({
        payment_status: 'failed',
        payment_failure_reason: reason,
        payment_failed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)
    
    console.log(`[Authorize.net Webhook] Updated order ${order.order_number} to FAILED: ${reason}`)
  }
}
