import { NextRequest, NextResponse } from 'next/server'
import { revolut } from '@/lib/revolut'
import { v4 as uuidv4 } from 'uuid'

// POST /api/revolut/card-payment
// Send money to a debit/credit card
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      account_id, 
      card_number, 
      first_name, 
      last_name, 
      amount, 
      currency, 
      reference 
    } = body

    // Validate required fields
    if (!account_id || !card_number || !first_name || !last_name || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: account_id, card_number, first_name, last_name, amount, currency' },
        { status: 400 }
      )
    }

    // Validate card number format (basic validation)
    const cleanCardNumber = card_number.replace(/\s/g, '')
    if (!/^\d{13,19}$/.test(cleanCardNumber)) {
      return NextResponse.json(
        { error: 'Invalid card number format' },
        { status: 400 }
      )
    }

    // Step 1: Create a card counterparty
    console.log('[Card Payment] Creating card counterparty...')
    const counterparty = await revolut.createCardCounterparty({
      individual_name: {
        first_name,
        last_name,
      },
      card_number: cleanCardNumber,
    })

    console.log('[Card Payment] Counterparty created:', counterparty.id)

    // Step 2: Find the card account from the counterparty
    // The card account is returned in the counterparty response
    const cardAccount = counterparty.accounts?.find(acc => acc.type === 'external')
    
    if (!cardAccount) {
      return NextResponse.json(
        { error: 'Failed to get card account from counterparty' },
        { status: 500 }
      )
    }

    // Step 3: Create the transfer to the card
    console.log('[Card Payment] Initiating transfer to card...')
    const transfer = await revolut.createCardPayment({
      request_id: uuidv4(),
      account_id,
      receiver: {
        counterparty_id: counterparty.id,
        card_id: cardAccount.id,
      },
      amount: parseFloat(amount),
      currency,
      reference: reference || `Card payment to ${first_name} ${last_name}`,
    })

    console.log('[Card Payment] Transfer initiated:', transfer.id, 'State:', transfer.state)

    return NextResponse.json({
      success: true,
      transfer: transfer,
      counterparty: {
        id: counterparty.id,
        name: counterparty.name,
      },
    })

  } catch (error: any) {
    console.error('[Card Payment] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process card payment' },
      { status: 500 }
    )
  }
}

