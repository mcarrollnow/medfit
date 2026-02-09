import { NextRequest, NextResponse } from 'next/server'
import { revolut, RevolutExchangeRequest } from '@/lib/revolut'
import { v4 as uuidv4 } from 'uuid'

// GET - Get exchange rate
export async function GET(request: NextRequest) {
  try {
    if (!process.env.REVOLUT_API_KEY && !process.env.REVOLUT_REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Revolut not configured' }, { status: 500 })
    }

    const searchParams = request.nextUrl.searchParams
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const amount = searchParams.get('amount') ? parseFloat(searchParams.get('amount')!) : undefined

    if (!from || !to) {
      return NextResponse.json({ error: 'from and to currencies are required' }, { status: 400 })
    }

    const rate = await revolut.getExchangeRate(from, to, amount)

    return NextResponse.json({
      rate: rate.rate,
      from: rate.from,
      to: rate.to,
      fee: rate.fee,
      rate_date: rate.rate_date,
    })
  } catch (error: any) {
    console.error('[Revolut Exchange Rate] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to get exchange rate' },
      { status: 500 }
    )
  }
}

// POST - Execute exchange
export async function POST(request: NextRequest) {
  try {
    if (!process.env.REVOLUT_API_KEY && !process.env.REVOLUT_REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Revolut not configured' }, { status: 500 })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.from_account_id || !body.to_account_id) {
      return NextResponse.json({ error: 'from_account_id and to_account_id are required' }, { status: 400 })
    }

    if (!body.from_currency || !body.to_currency) {
      return NextResponse.json({ error: 'from_currency and to_currency are required' }, { status: 400 })
    }

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
    }

    // Generate unique request ID for idempotency
    const requestId = body.request_id || uuidv4()

    const exchangeData: RevolutExchangeRequest = {
      request_id: requestId,
      from: {
        account_id: body.from_account_id,
        currency: body.from_currency,
        amount: body.amount,
      },
      to: {
        account_id: body.to_account_id,
        currency: body.to_currency,
      },
      reference: body.reference,
    }

    const exchange = await revolut.createExchange(exchangeData)

    return NextResponse.json({
      success: true,
      exchange: {
        id: exchange.id,
        state: exchange.state,
        created_at: exchange.created_at,
        completed_at: exchange.completed_at,
        request_id: requestId,
      },
    })
  } catch (error: any) {
    console.error('[Revolut Execute Exchange] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to execute exchange' },
      { status: 500 }
    )
  }
}

