'use server'

import { createServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export interface PaymentFallbackSettings {
  payment_fallback_enabled: boolean
  payment_fallback_message: string
  shopify_store_domain: string
  shopify_client_id: string
  shopify_access_token: string  // This is the Client Secret
  shopify_invoice_prefix: string
}

// Get payment fallback settings (public - no auth required for checkout to check)
export async function getPaymentFallbackSettings(): Promise<PaymentFallbackSettings | null> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('payment_fallback_enabled, payment_fallback_message, shopify_store_domain, shopify_client_id, shopify_access_token, shopify_invoice_prefix')
    .eq('id', '1')
    .single()
  
  if (error || !data) {
    console.error('[PaymentFallback] Error fetching settings:', error)
    return null
  }
  
  return data as PaymentFallbackSettings
}

// Check if payment fallback mode is enabled (simple check for checkout)
export async function isPaymentFallbackEnabled(): Promise<boolean> {
  const settings = await getPaymentFallbackSettings()
  return settings?.payment_fallback_enabled ?? false
}

// Update payment fallback settings (admin only)
export async function updatePaymentFallbackSettings(settings: Partial<PaymentFallbackSettings>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }
  
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single()
  
  // Allow admin, super_admin, or any role containing 'admin'
  const isAdmin = userData?.role?.toLowerCase().includes('admin')
  if (!isAdmin) {
    return { success: false, error: 'Admin access required' }
  }
  
  const { error } = await supabase
    .from('site_settings')
    .update({
      ...settings,
      updated_at: new Date().toISOString()
    })
    .eq('id', '1')
  
  if (error) {
    console.error('[PaymentFallback] Error updating settings:', error)
    return { success: false, error: error.message }
  }
  
  revalidatePath('/admin/settings')
  revalidatePath('/checkout')
  
  return { success: true }
}

// Send invoice via Shopify for an order
export async function sendShopifyInvoice(orderId: string): Promise<{ success: boolean; invoiceUrl?: string; error?: string }> {
  const supabase = await createServerClient()
  
  // Get order details
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      total_amount,
      customer_id,
      customers (
        id,
        user_id,
        users (
          email,
          first_name,
          last_name
        )
      )
    `)
    .eq('id', orderId)
    .single()
  
  if (orderError || !order) {
    return { success: false, error: 'Order not found' }
  }
  
  // Get Shopify settings
  const settings = await getPaymentFallbackSettings()
  if (!settings?.shopify_store_domain || !settings?.shopify_access_token) {
    return { success: false, error: 'Shopify not configured' }
  }
  
  const customer = order.customers as any
  const user = customer?.users as any
  const customerEmail = user?.email || ''
  const customerName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Customer'
  
  if (!customerEmail) {
    return { success: false, error: 'Customer email not found' }
  }
  
  try {
    // Build auth header with Client ID:Secret
    const basicAuth = Buffer.from(`${settings.shopify_client_id}:${settings.shopify_access_token}`).toString('base64')
    
    // Create draft order in Shopify with minimal info (no product details)
    const shopifyResponse = await fetch(
      `https://${settings.shopify_store_domain}/admin/api/2024-01/draft_orders.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          draft_order: {
            line_items: [
              {
                title: `Order ${settings.shopify_invoice_prefix}-${order.order_number}`,
                price: order.total_amount.toString(),
                quantity: 1,
                taxable: false
              }
            ],
            customer: {
              email: customerEmail,
              first_name: customerName.split(' ')[0],
              last_name: customerName.split(' ').slice(1).join(' ') || ''
            },
            email: customerEmail,
            use_customer_default_address: false,
            // Don't include shipping - invoice only
            shipping_line: null,
            note: `Payment invoice for order ${order.order_number}`,
            // Important: Don't add tags or metafields that reference your main store
          }
        })
      }
    )
    
    if (!shopifyResponse.ok) {
      const errorData = await shopifyResponse.json()
      console.error('[Shopify] Error creating draft order:', errorData)
      return { success: false, error: 'Failed to create Shopify invoice' }
    }
    
    const shopifyData = await shopifyResponse.json()
    const draftOrder = shopifyData.draft_order
    
    // Send invoice email from Shopify
    const sendInvoiceResponse = await fetch(
      `https://${settings.shopify_store_domain}/admin/api/2024-01/draft_orders/${draftOrder.id}/send_invoice.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          draft_order_invoice: {
            to: customerEmail,
            subject: `Invoice for your order`,
            custom_message: 'Thank you for your order. Please complete your payment using the link below.'
          }
        })
      }
    )
    
    if (!sendInvoiceResponse.ok) {
      console.error('[Shopify] Error sending invoice email')
      // Don't fail completely - the draft order was created
    }
    
    // Update order with Shopify invoice info
    await supabase
      .from('orders')
      .update({
        shopify_invoice_id: draftOrder.id.toString(),
        shopify_invoice_url: draftOrder.invoice_url,
        invoice_sent_at: new Date().toISOString(),
        payment_status: 'pending_invoice',
        payment_method: 'invoice'
      })
      .eq('id', orderId)
    
    return { 
      success: true, 
      invoiceUrl: draftOrder.invoice_url 
    }
    
  } catch (error) {
    console.error('[Shopify] Error:', error)
    return { success: false, error: 'Failed to send invoice' }
  }
}

// Called by Supabase edge function trigger (or can be called manually)
export async function processInvoiceOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
  console.log('[ProcessInvoice] Processing order:', orderId)
  
  const result = await sendShopifyInvoice(orderId)
  
  if (!result.success) {
    console.error('[ProcessInvoice] Failed:', result.error)
  } else {
    console.log('[ProcessInvoice] Invoice sent:', result.invoiceUrl)
  }
  
  return result
}

