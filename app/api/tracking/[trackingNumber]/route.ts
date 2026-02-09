import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const trackingNumber = params.trackingNumber
    const { searchParams } = new URL(request.url)
    const carrier = searchParams.get('carrier') // UPS, USPS, FedEx

    if (!trackingNumber) {
      return NextResponse.json({ error: 'Tracking number required' }, { status: 400 })
    }

    // Check for ShipEngine API key
    if (!process.env.SHIPENGINE_API_KEY) {
      return NextResponse.json({ error: 'ShipEngine API key not configured' }, { status: 500 })
    }

    console.log(`[Tracking] Fetching tracking for ${trackingNumber} (${carrier})`)

    // Map carrier names to ShipEngine codes
    const carrierMap: Record<string, string> = {
      'UPS': 'ups',
      'USPS': 'stamps_com',
      'FedEx': 'fedex'
    }

    const carrierCode = carrier ? (carrierMap[carrier] || carrier.toLowerCase()) : ''

    // Call ShipEngine Tracking API
    const trackingResponse = await fetch(
      `https://api.shipengine.com/v1/tracking?carrier_code=${carrierCode}&tracking_number=${encodeURIComponent(trackingNumber)}`,
      {
        headers: {
          'API-Key': process.env.SHIPENGINE_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!trackingResponse.ok) {
      const errorText = await trackingResponse.text()
      console.error('ShipEngine API error:', errorText)
      return NextResponse.json({ error: 'Failed to fetch tracking info' }, { status: 500 })
    }

    const trackingData = await trackingResponse.json()

    // Format response
    const formattedData = {
      tracking_number: trackingData.tracking_number,
      carrier: carrier || trackingData.carrier_code,
      status: trackingData.status_description,
      status_code: trackingData.status_code,
      shipped_date: trackingData.ship_date,
      estimated_delivery: trackingData.estimated_delivery_date,
      actual_delivery: trackingData.actual_delivery_date,
      exception: trackingData.exception_description,
      current_location: trackingData.events?.[0]?.city_locality 
        ? `${trackingData.events[0].city_locality}, ${trackingData.events[0].state_province}` 
        : null,
      events: trackingData.events?.map((event: any) => ({
        timestamp: event.occurred_at,
        status: event.description,
        location: event.city_locality 
          ? `${event.city_locality}, ${event.state_province}` 
          : event.country_code,
        details: event.signer || null
      })) || []
    }

    console.log('[Tracking] Data fetched:', formattedData.status)

    return NextResponse.json(formattedData)

  } catch (error) {
    console.error('Error fetching tracking:', error)
    return NextResponse.json({ error: 'Failed to fetch tracking information' }, { status: 500 })
  }
}
