// Supabase Edge Function: Update Shopify Invoice
// Triggered when an order with a Shopify invoice is updated
// Syncs the new total to the Shopify draft order

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface OrderUpdate {
  id: string
  order_number: string
  total_amount: number
  shopify_invoice_id: string | null
  payment_status: string
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

    // Get the order from webhook payload
    const { record, old_record, type } = await req.json()
    
    // Only process UPDATE events
    if (type !== 'UPDATE') {
      return new Response(JSON.stringify({ message: 'Not an update event' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    const order = record as OrderUpdate
    const oldOrder = old_record as OrderUpdate

    // Only process if:
    // 1. Order has a Shopify invoice
    // 2. Total amount changed
    // 3. Invoice hasn't been paid yet
    if (!order.shopify_invoice_id) {
      return new Response(JSON.stringify({ message: 'No Shopify invoice linked' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    if (order.total_amount === oldOrder.total_amount) {
      return new Response(JSON.stringify({ message: 'Total unchanged' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    if (order.payment_status === 'paid') {
      console.log('[UpdateShopifyInvoice] Order already paid, cannot update invoice')
      return new Response(JSON.stringify({ message: 'Order already paid' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    console.log(`[UpdateShopifyInvoice] Updating invoice for order ${order.order_number}`)
    console.log(`[UpdateShopifyInvoice] Old total: $${oldOrder.total_amount} -> New total: $${order.total_amount}`)

    // Get Shopify settings
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('shopify_store_domain, shopify_access_token, shopify_invoice_prefix')
      .eq('id', '1')
      .single()

    if (settingsError || !settings) {
      console.error('[UpdateShopifyInvoice] Failed to get settings:', settingsError)
      return new Response(JSON.stringify({ error: 'Settings not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    if (!settings.shopify_store_domain || !settings.shopify_access_token) {
      console.error('[UpdateShopifyInvoice] Shopify not configured')
      return new Response(JSON.stringify({ error: 'Shopify not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    // First, get the current draft order to find the line item ID
    const getDraftResponse = await fetch(
      `https://${settings.shopify_store_domain}/admin/api/2024-01/draft_orders/${order.shopify_invoice_id}.json`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': settings.shopify_access_token
        }
      }
    )

    if (!getDraftResponse.ok) {
      const errorText = await getDraftResponse.text()
      console.error('[UpdateShopifyInvoice] Failed to get draft order:', errorText)
      return new Response(JSON.stringify({ error: 'Failed to get draft order', details: errorText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    const draftData = await getDraftResponse.json()
    const draftOrder = draftData.draft_order

    // Check if draft order can still be updated
    // Allow updates for: open, invoice_sent
    // Block updates for: completed (paid)
    if (draftOrder.status === 'completed') {
      console.log(`[UpdateShopifyInvoice] Draft order is completed (paid), cannot update`)
      return new Response(JSON.stringify({ message: 'Draft order already paid, cannot update' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }
    
    console.log(`[UpdateShopifyInvoice] Draft order status: ${draftOrder.status} - proceeding with update`)

    // Update the draft order with new line item
    // We replace the line items with a new one with updated price
    const prefix = settings.shopify_invoice_prefix || 'INV'
    const updatePayload = {
      draft_order: {
        id: order.shopify_invoice_id,
        line_items: [
          {
            title: `Order ${prefix}-${order.order_number}`,
            price: order.total_amount.toString(),
            quantity: 1,
            taxable: false
          }
        ],
        note: `Payment invoice - Amount: $${order.total_amount.toFixed(2)} (Updated)`
      }
    }

    console.log('[UpdateShopifyInvoice] Updating Shopify draft order...')

    const updateResponse = await fetch(
      `https://${settings.shopify_store_domain}/admin/api/2024-01/draft_orders/${order.shopify_invoice_id}.json`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': settings.shopify_access_token
        },
        body: JSON.stringify(updatePayload)
      }
    )

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error('[UpdateShopifyInvoice] Shopify API error:', errorText)
      return new Response(JSON.stringify({ error: 'Shopify API error', details: errorText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    const updatedDraft = await updateResponse.json()
    console.log(`[UpdateShopifyInvoice] Draft order ${order.shopify_invoice_id} updated successfully`)

    // Optionally resend the invoice with the updated amount
    // Only if explicitly requested (we could add a flag for this)
    
    return new Response(
      JSON.stringify({
        success: true,
        draft_order_id: order.shopify_invoice_id,
        old_total: oldOrder.total_amount,
        new_total: order.total_amount,
        invoice_url: updatedDraft.draft_order?.invoice_url
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('[UpdateShopifyInvoice] Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

