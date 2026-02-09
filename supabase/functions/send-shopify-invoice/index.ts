// Supabase Edge Function: Send Shopify Invoice
// This function is triggered when an order is created with payment_method = 'invoice'
// It creates a draft order in Shopify and sends an invoice to the customer

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface OrderData {
  id: string
  order_number: string
  total_amount: number
  customer_id: string
}

interface ShopifySettings {
  shopify_store_domain: string
  shopify_client_id: string
  shopify_access_token: string  // This should be the Admin API access token (shpat_...)
  shopify_invoice_prefix: string
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

    // Get the order from the request body (webhook payload)
    const { record, type } = await req.json()
    
    // Only process INSERT events for invoice orders
    if (type !== 'INSERT') {
      return new Response(JSON.stringify({ message: 'Not an insert event' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    const order = record as OrderData
    
    // Check if this is an invoice order
    if (record.payment_method !== 'invoice') {
      return new Response(JSON.stringify({ message: 'Not an invoice order' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    console.log(`[SendShopifyInvoice] Processing order: ${order.id}`)

    // Get Shopify settings from site_settings
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('shopify_store_domain, shopify_client_id, shopify_access_token, shopify_invoice_prefix')
      .eq('id', '1')
      .single()

    if (settingsError || !settings) {
      console.error('[SendShopifyInvoice] Failed to get settings:', settingsError)
      return new Response(JSON.stringify({ error: 'Settings not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    const shopifySettings = settings as ShopifySettings

    if (!shopifySettings.shopify_store_domain || !shopifySettings.shopify_access_token) {
      console.error('[SendShopifyInvoice] Shopify not configured')
      return new Response(JSON.stringify({ error: 'Shopify not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    // Get customer details
    // Use explicit relationship hint since customers has two FKs to users (user_id and rep_id)
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select(`
        id,
        user_id,
        users!customers_user_id_fkey (
          email,
          first_name,
          last_name
        )
      `)
      .eq('id', order.customer_id)
      .single()

    if (customerError || !customer) {
      console.error('[SendShopifyInvoice] Customer not found:', customerError)
      return new Response(JSON.stringify({ error: 'Customer not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    const user = (customer as any).users
    const customerEmail = user?.email || ''
    const customerFirstName = user?.first_name || 'Customer'
    const customerLastName = user?.last_name || ''

    if (!customerEmail) {
      console.error('[SendShopifyInvoice] Customer email not found')
      return new Response(JSON.stringify({ error: 'Customer email not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    // Create draft order in Shopify
    // IMPORTANT: Only includes total amount and customer info - no product details or website branding
    const draftOrderPayload = {
      draft_order: {
        line_items: [
          {
            title: `Order ${shopifySettings.shopify_invoice_prefix}-${order.order_number}`,
            price: order.total_amount.toString(),
            quantity: 1,
            taxable: false
          }
        ],
        customer: {
          email: customerEmail,
          first_name: customerFirstName,
          last_name: customerLastName
        },
        email: customerEmail,
        use_customer_default_address: false,
        shipping_line: null,
        note: `Payment invoice - Amount: $${order.total_amount.toFixed(2)}`
      }
    }

    console.log('[SendShopifyInvoice] Creating Shopify draft order...')
    
    // Use X-Shopify-Access-Token header for Custom App authentication
    const shopifyResponse = await fetch(
      `https://${shopifySettings.shopify_store_domain}/admin/api/2024-01/draft_orders.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifySettings.shopify_access_token
        },
        body: JSON.stringify(draftOrderPayload)
      }
    )

    if (!shopifyResponse.ok) {
      const errorText = await shopifyResponse.text()
      console.error('[SendShopifyInvoice] Shopify API error:', errorText)
      return new Response(JSON.stringify({ error: 'Shopify API error', details: errorText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    const shopifyData = await shopifyResponse.json()
    const draftOrder = shopifyData.draft_order

    console.log(`[SendShopifyInvoice] Draft order created: ${draftOrder.id}`)

    // Send invoice email from Shopify
    const sendInvoiceResponse = await fetch(
      `https://${shopifySettings.shopify_store_domain}/admin/api/2024-01/draft_orders/${draftOrder.id}/send_invoice.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifySettings.shopify_access_token
        },
        body: JSON.stringify({
          draft_order_invoice: {
            to: customerEmail,
            subject: 'Invoice for your order',
            custom_message: 'Thank you for your order. Please complete your payment using the link below.'
          }
        })
      }
    )

    const invoiceSent = sendInvoiceResponse.ok
    if (!invoiceSent) {
      console.warn('[SendShopifyInvoice] Failed to send invoice email, but draft order was created')
    } else {
      console.log('[SendShopifyInvoice] Invoice email sent successfully')
    }

    // Update order with Shopify invoice details
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        shopify_invoice_id: draftOrder.id.toString(),
        shopify_invoice_url: draftOrder.invoice_url,
        invoice_sent_at: new Date().toISOString(),
        payment_status: 'pending_invoice'
      })
      .eq('id', order.id)

    if (updateError) {
      console.error('[SendShopifyInvoice] Failed to update order:', updateError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        draft_order_id: draftOrder.id,
        invoice_url: draftOrder.invoice_url,
        invoice_sent: invoiceSent
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('[SendShopifyInvoice] Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

