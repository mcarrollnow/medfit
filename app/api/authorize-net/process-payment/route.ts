import { NextRequest, NextResponse } from 'next/server'
import { getAuthorizeNetConfig, processPaymentWithToken } from '@/lib/authorize-net'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const config = getAuthorizeNetConfig()
    
    if (!config) {
      console.error('[Authorize.net] API credentials not configured')
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      )
    }

    const { 
      orderId, 
      orderNumber, 
      amount, 
      customerEmail,
      customerId,
      opaqueData,
      cardholderName,
      billingAddress,
    } = await request.json()

    if (!orderId || !orderNumber || !amount || !opaqueData) {
      return NextResponse.json(
        { error: 'Missing required payment data' },
        { status: 400 }
      )
    }

    // Don't log PII (billing address, customer details)
    console.log('[Authorize.net] Processing payment:', {
      orderId,
      orderNumber,
      amount,
      hasBillingAddress: !!billingAddress,
    })

    // Process the payment with the tokenized card data
    const result = await processPaymentWithToken(config, {
      amount,
      orderId,
      orderNumber,
      customerEmail,
      customerId,
      cardholderName,
      opaqueData,
      billingAddress,
    })

    if (!result.success) {
      console.error('[Authorize.net] Payment failed:', result.error)
      return NextResponse.json(
        { error: result.error || 'Payment failed' },
        { status: 400 }
      )
    }

    console.log('[Authorize.net] Payment successful:', result.transactionId)

    // Update order in database
    const supabase = getSupabaseAdminClient()
    if (supabase) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_provider: 'authorize_net',
          authorize_net_transaction_id: result.transactionId,
          paid_at: new Date().toISOString(),
        })
        .eq('id', orderId)
      
      if (updateError) {
        console.error('[Authorize.net] Failed to update order:', updateError)
        // Don't fail the response - payment was successful
      }
    }

    return NextResponse.json({
      success: true,
      transactionId: result.transactionId,
      authCode: result.authCode,
    })

  } catch (error: any) {
    console.error('[Authorize.net] Error:', error.message || error)
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    )
  }
}
