import { NextRequest, NextResponse } from 'next/server'
import { revolut } from '@/lib/revolut'
import { v4 as uuidv4 } from 'uuid'

// GET /api/revolut/cards - List all cards
export async function GET() {
  try {
    const cards = await revolut.getCards()
    
    return NextResponse.json({
      cards: cards,
      total: cards.length,
      active: cards.filter(c => c.state === 'active').length,
      virtual: cards.filter(c => c.virtual).length,
      physical: cards.filter(c => !c.virtual).length,
    })
  } catch (error: any) {
    console.error('[Revolut Cards] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch cards' },
      { status: 500 }
    )
  }
}

// POST /api/revolut/cards - Create a new card
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      holder_id, 
      label, 
      virtual = true,
      accounts,
      spending_limits,
    } = body

    if (!holder_id) {
      return NextResponse.json(
        { error: 'Missing required field: holder_id (team member ID)' },
        { status: 400 }
      )
    }

    const card = await revolut.createCard({
      request_id: uuidv4(),
      virtual,
      holder_id,
      label,
      accounts,
      spending_limits,
    })

    return NextResponse.json({
      success: true,
      card,
    })
  } catch (error: any) {
    console.error('[Revolut Cards] Error creating card:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create card' },
      { status: 500 }
    )
  }
}

