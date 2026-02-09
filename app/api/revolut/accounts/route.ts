import { NextRequest, NextResponse } from 'next/server'
import { revolut } from '@/lib/revolut'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.REVOLUT_API_KEY && !process.env.REVOLUT_REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Revolut not configured' }, { status: 500 })
    }

    const accounts = await revolut.getAccounts()

    // Format and enrich the data
    const formattedAccounts = accounts.map(account => ({
      id: account.id,
      name: account.name,
      balance: account.balance,
      currency: account.currency,
      state: account.state,
      public: account.public,
      created_at: account.created_at,
      updated_at: account.updated_at,
    }))

    // Calculate totals by currency
    const balancesByCurrency: Record<string, number> = {}
    formattedAccounts.forEach(acc => {
      if (acc.state === 'active') {
        balancesByCurrency[acc.currency] = (balancesByCurrency[acc.currency] || 0) + acc.balance
      }
    })

    return NextResponse.json({
      accounts: formattedAccounts,
      balances_by_currency: balancesByCurrency,
      total_accounts: formattedAccounts.length,
      active_accounts: formattedAccounts.filter(a => a.state === 'active').length,
    })
  } catch (error: any) {
    console.error('[Revolut Accounts] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch accounts' },
      { status: 500 }
    )
  }
}

