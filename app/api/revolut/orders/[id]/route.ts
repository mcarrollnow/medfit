import { NextRequest, NextResponse } from 'next/server'
import { revolutMerchant } from '@/lib/revolut'

// GET /api/revolut/orders/[id] - Get a specific order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await revolutMerchant.getOrder(id)

    return NextResponse.json({
      order: {
        ...order,
        order_amount: {
          ...order.order_amount,
          value: order.order_amount.value / 100,
        },
      },
    })
  } catch (error: any) {
    console.error('[Revolut Order] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// POST /api/revolut/orders/[id] - Actions: capture, cancel, refund
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action, amount, description } = body

    let order

    switch (action) {
      case 'capture':
        order = await revolutMerchant.captureOrder(id, amount)
        break
      case 'cancel':
        order = await revolutMerchant.cancelOrder(id)
        break
      case 'refund':
        if (!amount) {
          return NextResponse.json(
            { error: 'Amount required for refund' },
            { status: 400 }
          )
        }
        order = await revolutMerchant.refundOrder(id, amount, description)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: capture, cancel, or refund' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        order_amount: {
          ...order.order_amount,
          value: order.order_amount.value / 100,
        },
      },
    })
  } catch (error: any) {
    console.error('[Revolut Order Action] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process action' },
      { status: 500 }
    )
  }
}

