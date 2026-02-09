import { NextRequest, NextResponse } from 'next/server'
import { revolut } from '@/lib/revolut'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.REVOLUT_API_KEY && !process.env.REVOLUT_REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Revolut not configured' }, { status: 500 })
    }

    const searchParams = request.nextUrl.searchParams
    const from = searchParams.get('from') || undefined
    const to = searchParams.get('to') || undefined
    const counterparty = searchParams.get('counterparty') || undefined
    const count = searchParams.get('count') ? parseInt(searchParams.get('count')!) : 50
    const type = searchParams.get('type') || undefined

    const transactions = await revolut.getTransactions({
      from,
      to,
      counterparty,
      count,
      type,
    })

    // Enrich and format transactions
    const formattedTransactions = transactions.map(txn => {
      // Get the primary leg (usually first one)
      const primaryLeg = txn.legs[0]
      
      return {
        id: txn.id,
        type: txn.type,
        state: txn.state,
        amount: primaryLeg?.amount || 0,
        currency: primaryLeg?.currency || 'USD',
        description: primaryLeg?.description || txn.reference || '',
        reference: txn.reference,
        created_at: txn.created_at,
        completed_at: txn.completed_at,
        updated_at: txn.updated_at,
        reason_code: txn.reason_code,
        legs: txn.legs,
        merchant: txn.merchant,
        card: txn.card ? {
          last4: txn.card.card_number.slice(-4),
          name: `${txn.card.first_name} ${txn.card.last_name}`,
        } : null,
        related_transaction_id: txn.related_transaction_id,
      }
    })

    // Calculate summary stats
    const completed = formattedTransactions.filter(t => t.state === 'completed')
    const totalInbound = completed
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
    const totalOutbound = completed
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return NextResponse.json({
      transactions: formattedTransactions,
      total: formattedTransactions.length,
      summary: {
        total_inbound: totalInbound,
        total_outbound: totalOutbound,
        net: totalInbound - totalOutbound,
      },
    })
  } catch (error: any) {
    console.error('[Revolut Transactions] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

