// Supabase Edge Function: Shopify Webhook Receiver
// Receives webhooks from Shopify when invoices are paid
// Updates order status in Supabase

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// HMAC verification for Shopify webhooks
async function verifyShopifyWebhook(
  body: string,
  hmacHeader: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  const computedHmac = btoa(String.fromCharCode(...new Uint8Array(signature)))
  
  return computedHmac === hmacHeader
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get raw body for HMAC verification
    const rawBody = await req.text()
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256') || ''
    const topic = req.headers.get('x-shopify-topic') || ''
    const shopDomain = req.headers.get('x-shopify-shop-domain') || ''

    console.log(`[ShopifyWebhook] Received ${topic} from ${shopDomain}`)

    // Get webhook secret from settings for verification
    const { data: settings } = await supabase
      .from('site_settings')
      .select('shopify_webhook_secret')
      .eq('id', '1')
      .single()

    // Verify HMAC if secret is configured
    if (settings?.shopify_webhook_secret && hmacHeader) {
      const isValid = await verifyShopifyWebhook(rawBody, hmacHeader, settings.shopify_webhook_secret)
      if (!isValid) {
        console.error('[ShopifyWebhook] Invalid HMAC signature')
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        })
      }
      console.log('[ShopifyWebhook] HMAC verified')
    }

    // Parse the webhook payload
    const payload = JSON.parse(rawBody)

    // Handle different webhook topics
    switch (topic) {
      case 'draft_orders/update': {
        // Check if draft order was completed (converted to order = paid)
        if (payload.status === 'completed') {
          await handleDraftOrderCompleted(supabase, payload)
        }
        break
      }
      
      case 'orders/paid': {
        // This fires when the converted order is marked as paid
        await handleOrderPaid(supabase, payload)
        break
      }

      case 'orders/create': {
        // Draft order converted to order - could also indicate payment
        if (payload.source_name === 'shopify_draft_order') {
          await handleDraftOrderConverted(supabase, payload)
        }
        break
      }

      default:
        console.log(`[ShopifyWebhook] Unhandled topic: ${topic}`)
    }

    return new Response(
      JSON.stringify({ success: true, topic }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('[ShopifyWebhook] Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

// Handle when draft order is completed (paid)
async function handleDraftOrderCompleted(supabase: any, draftOrder: any) {
  const draftOrderId = draftOrder.id.toString()
  
  console.log(`[ShopifyWebhook] Draft order completed: ${draftOrderId}`)
  console.log(`[ShopifyWebhook] Draft order payload keys: ${Object.keys(draftOrder).join(', ')}`)

  // Find the order in Supabase by shopify_invoice_id
  const { data: order, error: findError } = await supabase
    .from('orders')
    .select('id, order_number, payment_status')
    .eq('shopify_invoice_id', draftOrderId)
    .single()

  if (findError || !order) {
    console.log(`[ShopifyWebhook] Order not found for draft order ${draftOrderId}`)
    return
  }

  // Extract any available payment details from draft order
  const paymentDetails: any = {
    shopify_payment_amount: parseFloat(draftOrder.total_price) || null
  }
  
  // Draft order might have the completed order ID if it was converted
  if (draftOrder.order_id) {
    paymentDetails.shopify_order_id = draftOrder.order_id.toString()
  }
  
  // Billing address from draft order
  const billing = draftOrder.billing_address || {}
  if (billing.address1 || billing.city) {
    paymentDetails.billing_name = [billing.first_name, billing.last_name].filter(Boolean).join(' ') || null
    paymentDetails.billing_address_line1 = billing.address1 || null
    paymentDetails.billing_city = billing.city || null
    paymentDetails.billing_state = billing.province_code || billing.province || null
    paymentDetails.billing_zip = billing.zip || null
    paymentDetails.billing_country = billing.country_code || billing.country || null
  }

  // Update order status to paid with payment details
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      status: 'confirmed',
      paid_at: new Date().toISOString(),
      payment_date: new Date().toISOString(),
      ...paymentDetails
    })
    .eq('id', order.id)

  if (updateError) {
    console.error('[ShopifyWebhook] Failed to update order:', updateError)
    return
  }

  console.log(`[ShopifyWebhook] Order ${order.order_number} marked as paid with details`)
}

// Handle when an order is paid (for orders created from draft orders)
async function handleOrderPaid(supabase: any, shopifyOrder: any) {
  // Check if this order came from a draft order
  // The draft_order_id might be in the note or we can match by email + amount
  const note = shopifyOrder.note || ''
  
  // Try to extract order reference from note
  const invoiceMatch = note.match(/INV-(\d+)/)
  if (!invoiceMatch) {
    console.log('[ShopifyWebhook] Order does not appear to be from our invoice system')
    return
  }

  const orderNumber = invoiceMatch[1]
  console.log(`[ShopifyWebhook] Order paid, matching order number: ${orderNumber}`)

  // Find and update the order
  const { data: order, error: findError } = await supabase
    .from('orders')
    .select('id, payment_status')
    .eq('order_number', orderNumber)
    .single()

  if (findError || !order) {
    console.log(`[ShopifyWebhook] Order not found: ${orderNumber}`)
    return
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      status: 'confirmed',
      paid_at: new Date().toISOString(),
      payment_date: new Date().toISOString()
    })
    .eq('id', order.id)

  if (updateError) {
    console.error('[ShopifyWebhook] Failed to update order:', updateError)
  } else {
    console.log(`[ShopifyWebhook] Order ${orderNumber} marked as paid`)
  }
}

// Extract payment details from Shopify order
function extractPaymentDetails(shopifyOrder: any) {
  const paymentDetails: any = {
    shopify_order_id: shopifyOrder.id?.toString() || null,
    shopify_payment_gateway: shopifyOrder.gateway || shopifyOrder.payment_gateway_names?.[0] || null,
    shopify_payment_amount: parseFloat(shopifyOrder.total_price) || null
  }

  // Get transaction details if available
  const transactions = shopifyOrder.transactions || []
  const successfulTransaction = transactions.find((t: any) => t.status === 'success' && t.kind === 'sale') 
    || transactions.find((t: any) => t.status === 'success')
  
  if (successfulTransaction) {
    paymentDetails.shopify_transaction_id = successfulTransaction.id?.toString() || null
    
    // Card details from payment_details
    const paymentMethod = successfulTransaction.payment_details || {}
    paymentDetails.card_brand = paymentMethod.credit_card_company || paymentMethod.card_brand || null
    paymentDetails.card_last_four = paymentMethod.credit_card_number?.slice(-4) || paymentMethod.last_four || null
    paymentDetails.card_exp_month = paymentMethod.credit_card_exp_month || null
    paymentDetails.card_exp_year = paymentMethod.credit_card_exp_year || null
    paymentDetails.shopify_payment_method = paymentMethod.credit_card_wallet || successfulTransaction.gateway || null
  }

  // Billing address from the order
  const billing = shopifyOrder.billing_address || {}
  if (billing.address1 || billing.city) {
    paymentDetails.billing_name = [billing.first_name, billing.last_name].filter(Boolean).join(' ') || null
    paymentDetails.billing_address_line1 = billing.address1 || null
    paymentDetails.billing_city = billing.city || null
    paymentDetails.billing_state = billing.province_code || billing.province || null
    paymentDetails.billing_zip = billing.zip || null
    paymentDetails.billing_country = billing.country_code || billing.country || null
  }

  // Log only non-sensitive payment info (PCI compliant)
  console.log('[ShopifyWebhook] Payment extracted:', {
    gateway: paymentDetails.shopify_payment_gateway,
    method: paymentDetails.shopify_payment_method,
    card_brand: paymentDetails.card_brand,
    last_four: paymentDetails.card_last_four ? '****' : null
  })
  return paymentDetails
}

// Handle when draft order is converted to a real order
async function handleDraftOrderConverted(supabase: any, shopifyOrder: any) {
  // When a draft order is paid, Shopify converts it to a regular order
  // The original draft order ID might be referenced
  
  console.log(`[ShopifyWebhook] Order created from draft: ${shopifyOrder.id}`)
  
  // Extract payment details from the Shopify order
  const paymentDetails = extractPaymentDetails(shopifyOrder)
  
  // Try to find by email and recent orders
  const customerEmail = shopifyOrder.email
  const totalPrice = parseFloat(shopifyOrder.total_price)

  // Find invoice orders for this customer that are pending
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id, 
      order_number, 
      total_amount,
      customer_id,
      customers!inner (
        user_id,
        users!customers_user_id_fkey (
          email
        )
      )
    `)
    .eq('payment_method', 'invoice')
    .eq('payment_status', 'pending_invoice')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error || !orders || orders.length === 0) {
    console.log('[ShopifyWebhook] No pending invoice orders found')
    return
  }

  // Find matching order by email and amount
  const matchingOrder = orders.find((order: any) => {
    const orderEmail = order.customers?.users?.email
    const amountMatch = Math.abs(order.total_amount - totalPrice) < 0.01
    return orderEmail === customerEmail && amountMatch
  })

  if (matchingOrder) {
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        paid_at: new Date().toISOString(),
        payment_date: new Date().toISOString(),
        ...paymentDetails
      })
      .eq('id', matchingOrder.id)

    if (!updateError) {
      console.log(`[ShopifyWebhook] Order ${matchingOrder.order_number} marked as paid via draft conversion with payment details`)
    }
  }
}

