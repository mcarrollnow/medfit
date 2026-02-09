import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

interface ShopifyPaymentDetails {
  shopify_order_id?: string
  shopify_transaction_id?: string
  shopify_payment_gateway?: string
  shopify_payment_method?: string
  shopify_payment_amount?: number
  card_brand?: string
  card_last_four?: string
  card_exp_month?: number
  card_exp_year?: number
  billing_name?: string
  billing_address_line1?: string
  billing_city?: string
  billing_state?: string
  billing_zip?: string
  billing_country?: string
  paid_at?: string
}

// Fetch draft order details from Shopify
async function fetchShopifyDraftOrder(
  storeDomain: string,
  accessToken: string,
  draftOrderId: string
) {
  const url = `https://${storeDomain}/admin/api/2024-01/draft_orders/${draftOrderId}.json`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    }
  })

  if (!response.ok) {
    const text = await response.text()
    console.error(`[SyncShopify] Failed to fetch draft order ${draftOrderId}:`, text)
    return null
  }

  const data = await response.json()
  return data.draft_order
}

// Fetch the converted order from Shopify (if draft order was completed)
async function fetchShopifyOrder(
  storeDomain: string,
  accessToken: string,
  orderId: string
) {
  const url = `https://${storeDomain}/admin/api/2024-01/orders/${orderId}.json`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    }
  })

  if (!response.ok) {
    const text = await response.text()
    console.error(`[SyncShopify] Failed to fetch order ${orderId}:`, text)
    return null
  }

  const data = await response.json()
  return data.order
}

// Fetch transactions for an order
async function fetchOrderTransactions(
  storeDomain: string,
  accessToken: string,
  orderId: string
) {
  const url = `https://${storeDomain}/admin/api/2024-01/orders/${orderId}/transactions.json`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    }
  })

  if (!response.ok) {
    console.error(`[SyncShopify] Failed to fetch transactions for order ${orderId}`)
    return []
  }

  const data = await response.json()
  return data.transactions || []
}

// Extract payment details from Shopify order/transaction
function extractPaymentDetails(
  draftOrder: any,
  shopifyOrder: any,
  transactions: any[]
): ShopifyPaymentDetails {
  const details: ShopifyPaymentDetails = {}

  // If we have a converted order
  if (shopifyOrder) {
    details.shopify_order_id = shopifyOrder.id?.toString()
    details.shopify_payment_gateway = shopifyOrder.gateway || shopifyOrder.payment_gateway_names?.[0]
    details.shopify_payment_amount = parseFloat(shopifyOrder.total_price) || undefined

    // Billing address from order
    const billing = shopifyOrder.billing_address || {}
    if (billing.address1 || billing.city) {
      details.billing_name = [billing.first_name, billing.last_name].filter(Boolean).join(' ') || undefined
      details.billing_address_line1 = billing.address1 || undefined
      details.billing_city = billing.city || undefined
      details.billing_state = billing.province_code || billing.province || undefined
      details.billing_zip = billing.zip || undefined
      details.billing_country = billing.country_code || billing.country || undefined
    }

    // Check if there's a processed_at or closed_at date
    if (shopifyOrder.processed_at) {
      details.paid_at = shopifyOrder.processed_at
    } else if (shopifyOrder.closed_at) {
      details.paid_at = shopifyOrder.closed_at
    }
  }

  // Get transaction details
  if (transactions.length > 0) {
    // Find a successful sale transaction
    const successfulTx = transactions.find(
      (t: any) => t.status === 'success' && t.kind === 'sale'
    ) || transactions.find(
      (t: any) => t.status === 'success'
    )

    if (successfulTx) {
      details.shopify_transaction_id = successfulTx.id?.toString()
      
      // Payment details from receipt
      const receipt = successfulTx.receipt || {}
      const paymentDetails = successfulTx.payment_details || {}
      
      // Card info - try multiple locations
      details.card_brand = paymentDetails.credit_card_company || 
                           paymentDetails.card_brand || 
                           receipt.card_brand ||
                           undefined
      
      details.card_last_four = paymentDetails.credit_card_number?.slice(-4) || 
                               paymentDetails.avs_result_code?.slice(-4) ||
                               undefined
      
      details.card_exp_month = paymentDetails.credit_card_exp_month || undefined
      details.card_exp_year = paymentDetails.credit_card_exp_year || undefined
      
      details.shopify_payment_method = paymentDetails.credit_card_wallet || 
                                       successfulTx.gateway || 
                                       undefined

      // Use transaction created_at if we don't have a paid_at yet
      if (!details.paid_at && successfulTx.created_at) {
        details.paid_at = successfulTx.created_at
      }
    }
  }

  // Fallback to draft order data if no order data
  if (!shopifyOrder && draftOrder) {
    details.shopify_payment_amount = parseFloat(draftOrder.total_price) || undefined
    
    // Billing address from draft order
    const billing = draftOrder.billing_address || {}
    if (billing.address1 || billing.city) {
      details.billing_name = [billing.first_name, billing.last_name].filter(Boolean).join(' ') || undefined
      details.billing_address_line1 = billing.address1 || undefined
      details.billing_city = billing.city || undefined
      details.billing_state = billing.province_code || billing.province || undefined
      details.billing_zip = billing.zip || undefined
      details.billing_country = billing.country_code || billing.country || undefined
    }

    if (draftOrder.completed_at) {
      details.paid_at = draftOrder.completed_at
    }
  }

  return details
}

export async function POST(request: NextRequest) {
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

    // Get Shopify settings
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('shopify_store_domain, shopify_access_token')
      .eq('id', '1')
      .single()

    if (settingsError || !settings) {
      return NextResponse.json({ error: 'Failed to fetch Shopify settings' }, { status: 500 })
    }

    if (!settings.shopify_store_domain || !settings.shopify_access_token) {
      return NextResponse.json({ 
        error: 'Shopify not configured. Please set up Shopify credentials in admin settings.' 
      }, { status: 400 })
    }

    const storeDomain = settings.shopify_store_domain
    const accessToken = settings.shopify_access_token

    // Get orders that have shopify_invoice_id and are paid but might be missing payment details
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select(`
        id, 
        order_number, 
        shopify_invoice_id,
        shopify_order_id,
        payment_status,
        payment_date,
        card_brand,
        card_last_four,
        billing_name
      `)
      .not('shopify_invoice_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(50)

    if (fetchError) {
      console.error('[SyncShopify] Error fetching orders:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        message: 'No orders with Shopify invoices found',
        synced: 0
      })
    }

    console.log(`[SyncShopify] Found ${orders.length} orders to check`)

    const results = {
      checked: 0,
      synced: 0,
      skipped: 0,
      failed: 0,
      errors: [] as string[],
      details: [] as any[]
    }

    for (const order of orders) {
      results.checked++

      try {
        // Skip if already has card details
        if (order.card_brand && order.card_last_four) {
          results.skipped++
          results.details.push({
            order_number: order.order_number,
            action: 'skipped',
            reason: 'Already has payment details'
          })
          continue
        }

        // Fetch draft order from Shopify
        const draftOrder = await fetchShopifyDraftOrder(
          storeDomain,
          accessToken,
          order.shopify_invoice_id
        )

        if (!draftOrder) {
          results.failed++
          results.errors.push(`Order ${order.order_number}: Draft order not found in Shopify`)
          continue
        }

        let shopifyOrder = null
        let transactions: any[] = []

        // If draft order was converted to a real order, fetch that
        if (draftOrder.order_id) {
          shopifyOrder = await fetchShopifyOrder(
            storeDomain,
            accessToken,
            draftOrder.order_id.toString()
          )

          if (shopifyOrder) {
            transactions = await fetchOrderTransactions(
              storeDomain,
              accessToken,
              draftOrder.order_id.toString()
            )
          }
        }

        // Extract payment details
        const paymentDetails = extractPaymentDetails(draftOrder, shopifyOrder, transactions)

        // Check if we have any new info to update
        const hasNewInfo = paymentDetails.card_brand || 
                          paymentDetails.card_last_four || 
                          paymentDetails.billing_name ||
                          paymentDetails.shopify_order_id

        if (!hasNewInfo) {
          results.skipped++
          results.details.push({
            order_number: order.order_number,
            action: 'skipped',
            reason: 'No payment details available from Shopify'
          })
          continue
        }

        // Build update data - only include non-empty values
        const updateData: Record<string, any> = {
          updated_at: new Date().toISOString()
        }

        // Only update fields that have values and aren't already set
        if (paymentDetails.shopify_order_id && !order.shopify_order_id) {
          updateData.shopify_order_id = paymentDetails.shopify_order_id
        }
        if (paymentDetails.shopify_transaction_id) {
          updateData.shopify_transaction_id = paymentDetails.shopify_transaction_id
        }
        if (paymentDetails.shopify_payment_gateway) {
          updateData.shopify_payment_gateway = paymentDetails.shopify_payment_gateway
        }
        if (paymentDetails.shopify_payment_method) {
          updateData.shopify_payment_method = paymentDetails.shopify_payment_method
        }
        if (paymentDetails.shopify_payment_amount) {
          updateData.shopify_payment_amount = paymentDetails.shopify_payment_amount
        }
        if (paymentDetails.card_brand && !order.card_brand) {
          updateData.card_brand = paymentDetails.card_brand
        }
        if (paymentDetails.card_last_four && !order.card_last_four) {
          updateData.card_last_four = paymentDetails.card_last_four
        }
        if (paymentDetails.card_exp_month) {
          updateData.card_exp_month = paymentDetails.card_exp_month
        }
        if (paymentDetails.card_exp_year) {
          updateData.card_exp_year = paymentDetails.card_exp_year
        }
        if (paymentDetails.billing_name && !order.billing_name) {
          updateData.billing_name = paymentDetails.billing_name
        }
        if (paymentDetails.billing_address_line1) {
          updateData.billing_address_line1 = paymentDetails.billing_address_line1
        }
        if (paymentDetails.billing_city) {
          updateData.billing_city = paymentDetails.billing_city
        }
        if (paymentDetails.billing_state) {
          updateData.billing_state = paymentDetails.billing_state
        }
        if (paymentDetails.billing_zip) {
          updateData.billing_zip = paymentDetails.billing_zip
        }
        if (paymentDetails.billing_country) {
          updateData.billing_country = paymentDetails.billing_country
        }

        // Update if draft order is completed and we don't have payment date
        if ((draftOrder.status === 'completed' || shopifyOrder) && !order.payment_date) {
          updateData.payment_status = 'paid'
          updateData.status = 'confirmed'
          updateData.payment_date = paymentDetails.paid_at || new Date().toISOString()
          updateData.paid_at = paymentDetails.paid_at || new Date().toISOString()
        }

        // Only update if we have something to update
        if (Object.keys(updateData).length <= 1) {
          results.skipped++
          continue
        }

        // Update the order
        const { error: updateError } = await supabase
          .from('orders')
          .update(updateData)
          .eq('id', order.id)

        if (updateError) {
          results.failed++
          results.errors.push(`Order ${order.order_number}: Update failed - ${updateError.message}`)
          continue
        }

        results.synced++
        results.details.push({
          order_number: order.order_number,
          action: 'synced',
          card_brand: paymentDetails.card_brand,
          card_last_four: paymentDetails.card_last_four,
          has_order: !!shopifyOrder
        })

        console.log(`[SyncShopify] Updated order ${order.order_number}`)

      } catch (error: any) {
        results.failed++
        results.errors.push(`Order ${order.order_number}: ${error.message}`)
        console.error(`[SyncShopify] Error processing order ${order.order_number}:`, error)
      }
    }

    return NextResponse.json({
      message: results.synced > 0 
        ? `Synced payment details for ${results.synced} order(s)` 
        : 'No orders needed syncing',
      synced: results.synced,
      results
    })

  } catch (error: any) {
    console.error('[SyncShopify] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET endpoint to check sync status
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Count orders that have Shopify invoice but might be missing details
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, order_number, shopify_invoice_id, card_brand, card_last_four, payment_status')
      .not('shopify_invoice_id', 'is', null)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    const needsSync = orders?.filter(o => !o.card_brand || !o.card_last_four) || []
    const hasDetails = orders?.filter(o => o.card_brand && o.card_last_four) || []

    return NextResponse.json({
      total_shopify_orders: orders?.length || 0,
      orders_needing_sync: needsSync.length,
      orders_with_details: hasDetails.length,
      orders: needsSync.map(o => ({
        order_number: o.order_number,
        payment_status: o.payment_status,
        has_card: !!o.card_brand
      }))
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

