import { NextRequest, NextResponse } from 'next/server'
import { syncProductsFromSheet, syncInventoryFromSheet, syncShipmentsFromSheet, syncProductCodesFromSheet } from '@/app/actions/sheets-sync'

// Verify the request is from a trusted source (Vercel Cron or your webhook)
function verifyRequest(request: NextRequest): boolean {
  // Check for Vercel Cron authorization
  const authHeader = request.headers.get('authorization')
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return true
  }

  // Check for custom API key
  const apiKey = request.headers.get('x-api-key')
  if (apiKey && apiKey === process.env.SHEETS_SYNC_API_KEY) {
    return true
  }

  return false
}

export async function POST(request: NextRequest) {
  // Verify authorization
  if (!verifyRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json().catch(() => ({}))
    const syncType = body.type || 'products'

    let result

    switch (syncType) {
      case 'products':
        result = await syncProductsFromSheet()
        break
      case 'inventory':
        result = await syncInventoryFromSheet()
        break
      case 'shipments':
        result = await syncShipmentsFromSheet()
        break
      case 'codes':
        result = await syncProductCodesFromSheet()
        break
      case 'all':
        const productsResult = await syncProductsFromSheet()
        const inventoryResult = await syncInventoryFromSheet()
        const shipmentsResult = await syncShipmentsFromSheet()
        result = {
          success: productsResult.success && inventoryResult.success && shipmentsResult.success,
          synced: productsResult.synced + inventoryResult.synced + shipmentsResult.synced,
          errors: productsResult.errors + inventoryResult.errors + shipmentsResult.errors,
          errorMessages: [...productsResult.errorMessages, ...inventoryResult.errorMessages, ...shipmentsResult.errorMessages],
        }
        break
      default:
        return NextResponse.json(
          { error: `Unknown sync type: ${syncType}` },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: result.success,
      synced: result.synced,
      errors: result.errors,
      errorMessages: result.errorMessages,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Sheets Sync] Error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// GET endpoint for simple health check / manual trigger
export async function GET(request: NextRequest) {
  if (!verifyRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const result = await syncProductsFromSheet()
  
  return NextResponse.json({
    ...result,
    timestamp: new Date().toISOString(),
  })
}

