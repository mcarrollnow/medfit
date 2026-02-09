import { NextRequest, NextResponse } from 'next/server'
import { revolutMerchant } from '@/lib/revolut'

// GET /api/revolut/orders - List all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const state = searchParams.get('state')
    
    const orders = await revolutMerchant.getOrders({
      limit: limit ? parseInt(limit) : 50,
      state: state || undefined,
    })

    // Calculate totals
    const completedOrders = orders.filter(o => o.state === 'completed')
    const totalReceived = completedOrders.reduce((sum, o) => {
      return sum + (o.order_amount.value / 100) // Convert from minor units
    }, 0)

    return NextResponse.json({
      orders: orders.map(o => ({
        ...o,
        order_amount: {
          ...o.order_amount,
          value: o.order_amount.value / 100, // Convert from minor units
        },
      })),
      total_orders: orders.length,
      completed_orders: completedOrders.length,
      total_received: totalReceived,
    })
  } catch (error: any) {
    console.error('[Revolut Orders] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/revolut/orders - Create a new order (payment link)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, description, customer_email, reference } = body

    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, currency' },
        { status: 400 }
      )
    }

    const order = await revolutMerchant.createOrder({
      amount: parseFloat(amount),
      currency,
      description,
      customer_email,
      merchant_order_ext_ref: reference,
      capture_mode: 'automatic',
    })

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        order_amount: {
          ...order.order_amount,
          value: order.order_amount.value / 100,
        },
      },
      checkout_url: order.checkout_url,
    })
  } catch (error: any) {
    console.error('[Revolut Orders] Error creating order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

