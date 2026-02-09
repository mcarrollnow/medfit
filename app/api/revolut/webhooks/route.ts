import { NextRequest, NextResponse } from 'next/server'
import { revolut } from '@/lib/revolut'

// GET - List webhooks
export async function GET(request: NextRequest) {
  try {
    if (!process.env.REVOLUT_API_KEY && !process.env.REVOLUT_REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Revolut not configured' }, { status: 500 })
    }

    const webhooks = await revolut.getWebhooks()

    return NextResponse.json({
      webhooks,
      total: webhooks.length,
    })
  } catch (error: any) {
    console.error('[Revolut Webhooks] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch webhooks' },
      { status: 500 }
    )
  }
}

// POST - Create webhook
export async function POST(request: NextRequest) {
  try {
    if (!process.env.REVOLUT_API_KEY && !process.env.REVOLUT_REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Revolut not configured' }, { status: 500 })
    }

    const body = await request.json()
    
    if (!body.url) {
      return NextResponse.json({ error: 'url is required' }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(body.url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    await revolut.createWebhook(body.url, body.events)

    return NextResponse.json({
      success: true,
      message: 'Webhook created successfully',
    })
  } catch (error: any) {
    console.error('[Revolut Create Webhook] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to create webhook' },
      { status: 500 }
    )
  }
}

// DELETE - Delete webhook
export async function DELETE(request: NextRequest) {
  try {
    if (!process.env.REVOLUT_API_KEY && !process.env.REVOLUT_REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Revolut not configured' }, { status: 500 })
    }

    const body = await request.json()
    
    if (!body.url) {
      return NextResponse.json({ error: 'url is required' }, { status: 400 })
    }

    await revolut.deleteWebhook(body.url)

    return NextResponse.json({
      success: true,
      message: 'Webhook deleted successfully',
    })
  } catch (error: any) {
    console.error('[Revolut Delete Webhook] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to delete webhook' },
      { status: 500 }
    )
  }
}

