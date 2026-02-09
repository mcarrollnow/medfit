import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { verifySupplyStoreAccess } from "@/lib/auth-utils"
import { getAuthorizeNetConfig, createHostedPaymentPage } from "@/lib/authorize-net"

export async function POST(request: NextRequest) {
  try {
    // Verify user has supply store access
    const authResult = await verifySupplyStoreAccess(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const { items } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    // Get Authorize.net config
    const authNetConfig = getAuthorizeNetConfig()
    if (!authNetConfig) {
      console.error('[supply-store/checkout] Authorize.net not configured')
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 })
    }

    const supabase = await createServerClient()
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Calculate totals
    const subtotal = items.reduce(
      (total: number, item: { product: { wholesale_price: number }; quantity: number }) =>
        total + item.product.wholesale_price * item.quantity,
      0
    )
    const shipping = subtotal >= 500 ? 0 : 49
    const total = subtotal + shipping

    // Generate order number
    const orderNumber = `SS-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Create pending order in database first
    const { data: order, error: orderError } = await supabase
      .from('supply_store_orders')
      .insert({
        order_number: orderNumber,
        user_id: authResult.user?.authId,
        customer_email: authResult.user?.email,
        customer_name: `${authResult.user?.firstName || ''} ${authResult.user?.lastName || ''}`.trim() || null,
        subtotal,
        shipping_cost: shipping,
        total,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('[supply-store/checkout] Order creation error:', orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: { product: { id: string; sku: string; product_name: string; brand: string; category: string; wholesale_price: number }; quantity: number }) => ({
      order_id: order.id,
      product_id: item.product.id,
      sku: item.product.sku,
      product_name: item.product.product_name,
      brand: item.product.brand,
      category: item.product.category,
      unit_price: item.product.wholesale_price,
      quantity: item.quantity,
      total_price: item.product.wholesale_price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('supply_store_order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('[supply-store/checkout] Order items error:', itemsError)
    }

    // Create Authorize.net hosted payment page
    const paymentPageResult = await createHostedPaymentPage(authNetConfig, {
      amount: total,
      orderId: order.id,
      orderNumber: orderNumber,
      customerEmail: authResult.user?.email,
      customerId: authResult.user?.authId,
      returnUrl: `${origin}/supply-store/checkout/success?order_id=${order.id}`,
      cancelUrl: `${origin}/supply-store/cart`,
      description: `Supply Store Order ${orderNumber}`,
      lineItems: items.map((item: { product: { id: string; product_name: string; wholesale_price: number }; quantity: number }, idx: number) => ({
        itemId: String(idx + 1),
        name: item.product.product_name,
        quantity: item.quantity,
        unitPrice: item.product.wholesale_price,
      })),
    })

    if (!paymentPageResult.success || !paymentPageResult.data) {
      console.error('[supply-store/checkout] Failed to create payment page:', paymentPageResult.error)

      // Mark order as failed
      await supabase
        .from('supply_store_orders')
        .update({ status: 'cancelled', notes: `Payment initialization failed: ${paymentPageResult.error}` })
        .eq('id', order.id)

      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
    }

    return NextResponse.json({ url: paymentPageResult.data.formUrl })
  } catch (error: any) {
    console.error("[supply-store/checkout] Exception:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
