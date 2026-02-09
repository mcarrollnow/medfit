// AfterShip API integration for enhanced tracking
// Using v4 API (stable)

const AFTERSHIP_API_KEY = process.env.AFTERSHIP_API_KEY
const API_BASE = "https://api.aftership.com/v4"

interface Checkpoint {
  created_at: string
  slug: string
  message: string
  location: string | null
  city: string | null
  state: string | null
  country_iso3: string | null
  country_name: string | null
  zip: string | null
  tag: string
  subtag: string
  subtag_message: string
}

interface Tracking {
  id: string
  tracking_number: string
  slug: string
  active: boolean
  tag: string
  subtag: string
  subtag_message: string
  title: string
  courier_tracking_link: string | null
  shipment_type: string | null
  origin_country_iso3: string | null
  destination_country_iso3: string | null
  expected_delivery: string | null
  checkpoints: Checkpoint[]
}

export interface TrackingInfo {
  tracking_number: string
  status_code: string
  status_description: string
  carrier: string
  carrier_name: string
  carrier_link: string | null
  estimated_delivery: string | null
  origin_country: string | null
  destination_country: string | null
  last_location: string | null
  last_update: string | null
  events: {
    date: string
    description: string
    location: string
    tag: string
  }[]
}

// AfterShip delivery status tags
const statusLabels: Record<string, string> = {
  'Pending': 'Pending',
  'InfoReceived': 'Info Received',
  'InTransit': 'In Transit',
  'OutForDelivery': 'Out for Delivery',
  'AttemptFail': 'Delivery Attempt Failed',
  'Delivered': 'Delivered',
  'AvailableForPickup': 'Available for Pickup',
  'Exception': 'Exception',
  'Expired': 'Expired',
}

const statusColors: Record<string, string> = {
  'Pending': 'text-gray-400',
  'InfoReceived': 'text-blue-300',
  'InTransit': 'text-blue-400',
  'OutForDelivery': 'text-cyan-400',
  'AttemptFail': 'text-yellow-400',
  'Delivered': 'text-green-400',
  'AvailableForPickup': 'text-purple-400',
  'Exception': 'text-red-400',
  'Expired': 'text-gray-500',
}

export function getStatusLabel(tag: string): string {
  return statusLabels[tag] || tag
}

export function getStatusColor(tag: string): string {
  return statusColors[tag] || 'text-gray-400'
}

function getHeaders() {
  return {
    'aftership-api-key': AFTERSHIP_API_KEY!,
    'Content-Type': 'application/json',
  }
}

// Detect carrier from tracking number
async function detectCarrier(trackingNumber: string): Promise<{ slug: string; name: string }[]> {
  console.log('[AfterShip] Detecting carrier for:', trackingNumber)
  
  try {
    const response = await fetch(`${API_BASE}/couriers/detect`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        tracking: {
          tracking_number: trackingNumber
        }
      }),
    })

    const data = await response.json()
    console.log('[AfterShip] Detect response:', response.status, JSON.stringify(data.meta || {}))

    if (response.ok && data.data?.couriers) {
      const couriers = data.data.couriers
      console.log('[AfterShip] Detected:', couriers.map((c: {slug: string}) => c.slug).join(', '))
      return couriers
    }
    
    return []
  } catch (error) {
    console.error('[AfterShip] Detect error:', error)
    return []
  }
}

// Create tracking
async function createTracking(trackingNumber: string, slug?: string): Promise<Tracking | null> {
  console.log('[AfterShip] Creating tracking:', trackingNumber, 'slug:', slug)
  
  try {
    const body: { tracking: { tracking_number: string; slug?: string } } = {
      tracking: {
        tracking_number: trackingNumber
      }
    }
    if (slug) {
      body.tracking.slug = slug
    }

    const response = await fetch(`${API_BASE}/trackings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log('[AfterShip] Create response:', response.status, data.meta?.code || 'OK')

    if (response.ok) {
      return data.data?.tracking || null
    }
    
    // 4003 = already exists
    if (data.meta?.code === 4003) {
      console.log('[AfterShip] Tracking already exists')
    }
    
    return null
  } catch (error) {
    console.error('[AfterShip] Create error:', error)
    return null
  }
}

// Get tracking by slug and number
async function getTracking(slug: string, trackingNumber: string): Promise<Tracking | null> {
  console.log('[AfterShip] Getting tracking:', slug, trackingNumber)
  
  try {
    const response = await fetch(`${API_BASE}/trackings/${slug}/${trackingNumber}`, {
      headers: getHeaders(),
    })

    const data = await response.json()
    console.log('[AfterShip] Get response:', response.status, data.data?.tracking?.tag || 'no data')

    if (response.ok && data.data?.tracking) {
      return data.data.tracking
    }
    
    return null
  } catch (error) {
    console.error('[AfterShip] Get error:', error)
    return null
  }
}

export async function getTrackingInfo(
  trackingNumber: string,
  _carrier?: string
): Promise<TrackingInfo | null> {
  // Don't log tracking numbers in detail
  console.log('[AfterShip] Fetching tracking info...')
  
  if (!AFTERSHIP_API_KEY) {
    console.error('[AfterShip] No API key!')
    return null
  }

  if (!trackingNumber?.trim()) {
    console.warn('[AfterShip] Empty tracking number')
    return null
  }

  // Handle multiple tracking numbers (take first one)
  // They can be separated by commas, newlines, carriage returns, or multiple spaces
  let cleanNumber = trackingNumber
    .replace(/\r\n/g, '\n')  // Normalize Windows line endings
    .replace(/\r/g, '\n')    // Normalize old Mac line endings
    .split('\n')[0]          // Take first line
    .split(',')[0]           // Take first comma-separated value
    .split(/\s+/)[0]         // Take first space-separated value
    .trim()
  
  console.log('[AfterShip] Clean tracking number:', cleanNumber)

  try {
    // Step 1: Detect carrier
    const couriers = await detectCarrier(cleanNumber)
    
    if (couriers.length === 0) {
      console.log('[AfterShip] No carrier detected')
      return null
    }

    const slug = couriers[0].slug
    const carrierName = couriers[0].name

    // Step 2: Try to get existing tracking
    let tracking = await getTracking(slug, cleanNumber)

    // Step 3: If not found, create and retry
    if (!tracking) {
      await createTracking(cleanNumber, slug)
      // Small delay for AfterShip to process
      await new Promise(r => setTimeout(r, 500))
      tracking = await getTracking(slug, cleanNumber)
    }

    if (!tracking) {
      console.log('[AfterShip] Could not get tracking data')
      return null
    }

    // Build result
    const lastCheckpoint = tracking.checkpoints?.[0]
    let lastLocation: string | null = null
    
    if (lastCheckpoint) {
      const parts = [lastCheckpoint.city, lastCheckpoint.state, lastCheckpoint.country_name].filter(Boolean)
      lastLocation = parts.join(', ') || lastCheckpoint.location
    }

    console.log('[AfterShip] Success:', tracking.tag, tracking.checkpoints?.length || 0, 'events')
    console.log('[AfterShip] ========================================')

    return {
      tracking_number: tracking.tracking_number,
      status_code: tracking.tag,
      status_description: tracking.subtag_message || getStatusLabel(tracking.tag),
      carrier: tracking.slug,
      carrier_name: tracking.title || carrierName || tracking.slug,
      carrier_link: tracking.courier_tracking_link,
      estimated_delivery: tracking.expected_delivery,
      origin_country: tracking.origin_country_iso3,
      destination_country: tracking.destination_country_iso3,
      last_location: lastLocation,
      last_update: lastCheckpoint?.created_at || null,
      events: (tracking.checkpoints || []).map((cp) => ({
        date: cp.created_at,
        description: cp.message || cp.subtag_message || '',
        location: [cp.city, cp.state, cp.country_name].filter(Boolean).join(', ') || cp.location || '',
        tag: cp.tag,
      })),
    }
  } catch (error) {
    console.error('[AfterShip] Error:', error)
    return null
  }
}
