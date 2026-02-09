import { NextRequest, NextResponse } from 'next/server'
import { revolut } from '@/lib/revolut'

// GET /api/revolut/cards/[id] - Get card details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const card = await revolut.getCard(id)

    return NextResponse.json({ card })
  } catch (error: any) {
    console.error('[Revolut Card] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch card' },
      { status: 500 }
    )
  }
}

// PATCH /api/revolut/cards/[id] - Update card
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { label, spending_limits, accounts, categories } = body

    const card = await revolut.updateCard(id, {
      label,
      spending_limits,
      accounts,
      categories,
    })

    return NextResponse.json({
      success: true,
      card,
    })
  } catch (error: any) {
    console.error('[Revolut Card] Error updating:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update card' },
      { status: 500 }
    )
  }
}

// POST /api/revolut/cards/[id] - Card actions (freeze, unfreeze)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action } = body

    let card

    switch (action) {
      case 'freeze':
        card = await revolut.freezeCard(id)
        break
      case 'unfreeze':
        card = await revolut.unfreezeCard(id)
        break
      case 'sensitive_details':
        const details = await revolut.getCardSensitiveDetails(id)
        return NextResponse.json({ success: true, details })
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: freeze, unfreeze, or sensitive_details' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      card,
    })
  } catch (error: any) {
    console.error('[Revolut Card Action] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process action' },
      { status: 500 }
    )
  }
}

// DELETE /api/revolut/cards/[id] - Terminate card
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await revolut.terminateCard(id)

    return NextResponse.json({
      success: true,
      message: 'Card terminated',
    })
  } catch (error: any) {
    console.error('[Revolut Card] Error terminating:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to terminate card' },
      { status: 500 }
    )
  }
}

