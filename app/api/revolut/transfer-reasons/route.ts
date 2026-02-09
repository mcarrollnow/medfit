import { NextRequest, NextResponse } from 'next/server'
import { revolut } from '@/lib/revolut'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.REVOLUT_API_KEY && !process.env.REVOLUT_REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Revolut not configured' }, { status: 500 })
    }

    const searchParams = request.nextUrl.searchParams
    const counterpartyCountry = searchParams.get('country') || undefined
    const currency = searchParams.get('currency') || undefined

    const reasons = await revolut.getTransferReasons(counterpartyCountry, currency)

    return NextResponse.json({
      reasons,
      total: reasons.length,
    })
  } catch (error: any) {
    console.error('[Revolut Transfer Reasons] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transfer reasons' },
      { status: 500 }
    )
  }
}

