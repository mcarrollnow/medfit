import { createClient } from '@supabase/supabase-js'
import { siteConfig } from '@/lib/site-config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type LabelStyle = 'classic' | 'glass'

export interface ShippingLabelData {
  recipient: {
    name: string
    company?: string
    address_line1: string
    address_line2?: string
    city: string
    state: string
    zip: string
    country: string
    phone?: string
  }
  sender: {
    name: string
    company?: string
    address_line1: string
    city: string
    state: string
    zip: string
    country: string
  }
  order_number: string
  order_date: string
  tracking_number?: string
  carrier?: string
  weight?: string
  service?: string
  label_style?: LabelStyle
  qr_code_url?: string
  items: Array<{
    name: string
    quantity: number
    barcode?: string
  }>
}

/**
 * Create a shipping label print job for an order
 * Call this when a payment is confirmed
 */
export async function createShippingLabelJob(
  orderId: string,
  options?: { label_style?: LabelStyle; weight?: string; service?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Fetch order with customer and item details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        created_at,
        tracking_number,
        shipping_carrier,
        customers (
          id,
          shipping_address_line1,
          shipping_address_line2,
          shipping_city,
          shipping_state,
          shipping_zip,
          shipping_country,
          phone,
          company_name,
          users!customers_user_id_fkey (
            first_name,
            last_name,
            email,
            phone
          )
        ),
        order_items (
          id,
          product_name,
          product_barcode,
          quantity
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('[PrintJobHelper] Order not found:', orderId)
      return { success: false, error: 'Order not found' }
    }

    // Extract customer info
    const customer = order.customers as any
    const user = Array.isArray(customer?.users) ? customer.users[0] : customer?.users

    // Build recipient address
    const recipient = {
      name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Customer' : 'Customer',
      company: customer?.company_name,
      address_line1: customer?.shipping_address_line1 || '',
      address_line2: customer?.shipping_address_line2,
      city: customer?.shipping_city || '',
      state: customer?.shipping_state || '',
      zip: customer?.shipping_zip || '',
      country: customer?.shipping_country || 'US',
      phone: user?.phone || customer?.phone
    }

    // Skip if no address
    if (!recipient.address_line1 || !recipient.city) {
      console.log('[PrintJobHelper] Skipping label - no shipping address for order:', order.order_number)
      return { success: false, error: 'No shipping address' }
    }

    // Sender address (your business)
    const sender = {
      name: 'Medfit 90',
      company: 'Medfit 90',
      address_line1: process.env.BUSINESS_ADDRESS_LINE1 || '',
      city: process.env.BUSINESS_CITY || '',
      state: process.env.BUSINESS_STATE || '',
      zip: process.env.BUSINESS_ZIP || '',
      country: 'US'
    }

    // Create the print job
    const { error: printError } = await supabase
      .from('print_jobs')
      .insert({
        job_type: 'shipping_label',
        order_id: order.id,
        order_number: order.order_number,
        label_data: {
          recipient,
          sender,
          order_number: order.order_number,
          order_date: order.created_at,
          tracking_number: order.tracking_number,
          carrier: order.shipping_carrier,
          weight: options?.weight,
          service: options?.service,
          label_style: options?.label_style || (process.env.DEFAULT_LABEL_STYLE as LabelStyle) || 'glass',
          qr_code_url: `${process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : siteConfig.appUrl)}/order-photos/${order.order_number}`,
          items: (order.order_items as any[])?.map(item => ({
            name: item.product_name,
            quantity: item.quantity,
            barcode: item.product_barcode
          })) || []
        },
        priority: 1, // Shipping labels are high priority
        created_by: 'webhook:payment'
      })

    if (printError) {
      console.error('[PrintJobHelper] Error creating print job:', printError)
      return { success: false, error: printError.message }
    }

    console.log(`[PrintJobHelper] Created shipping label job for order ${order.order_number}`)
    return { success: true }

  } catch (error) {
    console.error('[PrintJobHelper] Unexpected error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Create a packing slip print job for an order
 */
export async function createPackingSlipJob(orderId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        created_at,
        order_items (
          id,
          product_name,
          product_barcode,
          quantity
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return { success: false, error: 'Order not found' }
    }

    const { error: printError } = await supabase
      .from('print_jobs')
      .insert({
        job_type: 'packing_slip',
        order_id: order.id,
        order_number: order.order_number,
        label_data: {
          order_number: order.order_number,
          order_date: order.created_at,
          items: (order.order_items as any[])?.map(item => ({
            name: item.product_name,
            quantity: item.quantity,
            barcode: item.product_barcode
          })) || []
        },
        priority: 2, // Slightly lower priority than shipping labels
        created_by: 'webhook:payment'
      })

    if (printError) {
      return { success: false, error: printError.message }
    }

    console.log(`[PrintJobHelper] Created packing slip job for order ${order.order_number}`)
    return { success: true }

  } catch (error) {
    return { success: false, error: String(error) }
  }
}

/**
 * Create both shipping label and packing slip for an order
 */
export async function createOrderPrintJobs(orderId: string): Promise<{ success: boolean; errors?: string[] }> {
  const errors: string[] = []

  const labelResult = await createShippingLabelJob(orderId)
  if (!labelResult.success && labelResult.error) {
    errors.push(`Shipping label: ${labelResult.error}`)
  }

  const slipResult = await createPackingSlipJob(orderId)
  if (!slipResult.success && slipResult.error) {
    errors.push(`Packing slip: ${slipResult.error}`)
  }

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  }
}
