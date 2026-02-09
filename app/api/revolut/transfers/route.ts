import { NextRequest, NextResponse } from 'next/server'
import { revolut, RevolutTransferRequest } from '@/lib/revolut'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.REVOLUT_API_KEY && !process.env.REVOLUT_REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Revolut not configured' }, { status: 500 })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.account_id) {
      return NextResponse.json({ error: 'account_id is required' }, { status: 400 })
    }

    if (!body.counterparty_id) {
      return NextResponse.json({ error: 'counterparty_id is required' }, { status: 400 })
    }

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
    }

    if (!body.currency) {
      return NextResponse.json({ error: 'currency is required' }, { status: 400 })
    }

    // Generate unique request ID for idempotency
    const requestId = body.request_id || uuidv4()

    const transferData: RevolutTransferRequest = {
      request_id: requestId,
      account_id: body.account_id,
      receiver: {
        counterparty_id: body.counterparty_id,
        account_id: body.receiver_account_id,
        card_id: body.receiver_card_id,
      },
      amount: body.amount,
      currency: body.currency,
      reference: body.reference,
      charge_bearer: body.charge_bearer,
      transfer_reason_code: body.transfer_reason_code,
      exchange_reason_code: body.exchange_reason_code,
    }

    const transfer = await revolut.createTransfer(transferData)

    return NextResponse.json({
      success: true,
      transfer: {
        id: transfer.id,
        state: transfer.state,
        created_at: transfer.created_at,
        completed_at: transfer.completed_at,
        request_id: requestId,
        amount: body.amount,
        currency: body.currency,
      },
    })
  } catch (error: any) {
    console.error('[Revolut Create Transfer] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to create transfer' },
      { status: 500 }
    )
  }
}

