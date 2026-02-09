import { PaymentTracker } from "@/components/payment-tracker"
import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import GlobalNav from "@/components/global-nav"

interface PageProps {
  params: Promise<{
    orderId: string
  }>
}

export default async function PaymentPage({ params }: PageProps) {
  const { orderId } = await params

  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[Payment Status] Missing Supabase environment variables')
    notFound()
  }

  // Fetch real order data
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // Try to find order by UUID first, then by order_number
  const isUuid = orderId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      total_amount,
      shipping_amount,
      tax_amount,
      discount_amount,
      expected_payment_amount,
      expected_payment_currency,
      payment_status,
      transaction_hash,
      payment_metadata,
      created_at,
      customers (
        id,
        users!customers_user_id_fkey (
          first_name,
          last_name
        ),
        shipping_addresses (
          address_line1,
          address_line2,
          city,
          state,
          zip,
          country
        )
      ),
      order_items (
        product_name,
        quantity,
        unit_price
      )
    `)
    .eq(isUuid ? 'id' : 'order_number', orderId)
    .single()

  if (error) {
    console.error('[Payment Status] Database error:', error)
    notFound()
  }

  if (!order) {
    console.error('[Payment Status] Order not found:', orderId)
    notFound()
  }

  // Calculate subtotal from order items (with fallback)
  const subtotal = order.order_items?.reduce((sum: number, item: any) => 
    sum + (item.unit_price * item.quantity), 0
  ) || order.total_amount || 0

  // Format order name from items (with fallback)
  const orderName = order.order_items?.length === 1
    ? order.order_items[0].product_name
    : order.order_items?.length 
      ? `${order.order_items.length} Products`
      : 'Order'

  // Get customer name (arrays from supabase, with fallback)
  const customer = Array.isArray(order.customers) ? order.customers[0] : order.customers
  const user = customer?.users?.[0] || customer?.users
  const customerName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Customer'
    : 'Customer'

  // Get shipping address (nested inside customer, arrays from supabase, with fallback)
  const addresses = customer?.shipping_addresses
  const address = Array.isArray(addresses) ? addresses[0] : addresses
    
  const shippingAddress = {
    name: customerName,
    street: address?.address_line1 
      ? `${address.address_line1}${address.address_line2 ? ', ' + address.address_line2 : ''}`
      : 'Address not available',
    city: address?.city || '',
    state: address?.state || '',
    zip: address?.zip || '',
    country: address?.country || 'USA'
  }

  // Extract payment metadata (wallet addresses, gas fees)
  const paymentMeta = order.payment_metadata as {
    from_wallet?: string
    to_wallet?: string
    gas_fee_eth?: string
    gas_fee_usd?: number
    eth_price?: number
  } | null

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />
      <PaymentTracker 
        orderId={orderId}
        customerName={customerName}
        orderName={orderName}
        shippingAddress={shippingAddress}
        priceDetails={{
          subtotal: subtotal,
          shipping: order.shipping_amount || 0,
          discount: order.discount_amount || 0,
          total: order.total_amount || 0
        }}
        cryptoAmount={{
          eth: order.expected_payment_amount || '0',
          usd: order.total_amount || 0
        }}
        transactionHash={order.transaction_hash}
        fromWallet={paymentMeta?.from_wallet}
        toWallet={paymentMeta?.to_wallet}
        gasFee={paymentMeta?.gas_fee_eth ? {
          eth: paymentMeta.gas_fee_eth,
          usd: paymentMeta.gas_fee_usd || 0
        } : undefined}
      />
    </div>
  )
}
