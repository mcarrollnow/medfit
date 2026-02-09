import { NextRequest, NextResponse } from 'next/server'
import { revolut, CreateCounterpartyRequest } from '@/lib/revolut'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.REVOLUT_API_KEY && !process.env.REVOLUT_REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Revolut not configured' }, { status: 500 })
    }

    const counterparties = await revolut.getCounterparties()

    // Filter out deleted counterparties
    const activeCounterparties = counterparties.filter(cp => cp.state !== 'deleted')

    return NextResponse.json({
      counterparties: activeCounterparties,
      total: counterparties.length,
      active: activeCounterparties.length,
    })
  } catch (error: any) {
    console.error('[Revolut Counterparties] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch counterparties' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.REVOLUT_API_KEY && !process.env.REVOLUT_REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Revolut not configured' }, { status: 500 })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.profile_type) {
      return NextResponse.json({ error: 'profile_type is required' }, { status: 400 })
    }

    if (!body.bank_country || !body.currency) {
      return NextResponse.json({ error: 'bank_country and currency are required' }, { status: 400 })
    }

    // Require either company_name or individual_name
    if (body.profile_type === 'business' && !body.company_name) {
      return NextResponse.json({ error: 'company_name is required for business profile' }, { status: 400 })
    }

    if (body.profile_type === 'personal' && !body.individual_name) {
      return NextResponse.json({ error: 'individual_name is required for personal profile' }, { status: 400 })
    }

    const counterpartyData: CreateCounterpartyRequest = {
      profile_type: body.profile_type,
      bank_country: body.bank_country,
      currency: body.currency,
      company_name: body.company_name,
      individual_name: body.individual_name,
      name: body.name,
      phone: body.phone,
      email: body.email,
      address: body.address,
      // Bank account details
      revolut_account_id: body.revolut_account_id,
      account_no: body.account_no,
      iban: body.iban,
      sort_code: body.sort_code,
      routing_number: body.routing_number,
      bic: body.bic,
    }

    const counterparty = await revolut.createCounterparty(counterpartyData)

    return NextResponse.json({
      success: true,
      counterparty,
    })
  } catch (error: any) {
    console.error('[Revolut Create Counterparty] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to create counterparty' },
      { status: 500 }
    )
  }
}

