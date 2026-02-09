"use server"

import { getTrackingInfo, getStatusLabel, getStatusColor } from "@/lib/aftership"

// Check if API key is configured
const hasApiKey = !!process.env.AFTERSHIP_API_KEY
console.log('[Tracking Action] AfterShip API key configured:', hasApiKey)

export interface TrackingResult {
  success: boolean
  tracking_number: string
  status: string
  status_label: string
  status_color: string
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
  error?: string
}

export async function fetchTrackingInfo(
  trackingNumber: string,
  carrier?: string
): Promise<TrackingResult> {
  if (!trackingNumber) {
    return {
      success: false,
      tracking_number: trackingNumber,
      status: 'Pending',
      status_label: 'Unknown',
      status_color: 'text-gray-400',
      carrier: carrier || 'Unknown',
      carrier_name: carrier || 'Unknown',
      carrier_link: null,
      estimated_delivery: null,
      origin_country: null,
      destination_country: null,
      last_location: null,
      last_update: null,
      events: [],
      error: 'No tracking number provided',
    }
  }

  try {
    const info = await getTrackingInfo(trackingNumber, carrier)

    if (!info) {
      return {
        success: false,
        tracking_number: trackingNumber,
        status: 'Pending',
        status_label: 'Not Found',
        status_color: 'text-gray-400',
        carrier: carrier || 'Unknown',
        carrier_name: carrier || 'Unknown',
        carrier_link: null,
        estimated_delivery: null,
        origin_country: null,
        destination_country: null,
        last_location: null,
        last_update: null,
        events: [],
        error: 'Tracking info not available',
      }
    }

    return {
      success: true,
      tracking_number: info.tracking_number,
      status: info.status_code,
      status_label: getStatusLabel(info.status_code),
      status_color: getStatusColor(info.status_code),
      carrier: info.carrier,
      carrier_name: info.carrier_name,
      carrier_link: info.carrier_link,
      estimated_delivery: info.estimated_delivery,
      origin_country: info.origin_country,
      destination_country: info.destination_country,
      last_location: info.last_location,
      last_update: info.last_update,
      events: info.events,
    }
  } catch (error) {
    console.error('[Tracking Action] Error fetching tracking:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Tracking Action] Error details:', errorMessage)
    
    return {
      success: false,
      tracking_number: trackingNumber,
      status: 'Pending',
      status_label: 'Error',
      status_color: 'text-red-400',
      carrier: carrier || 'Unknown',
      carrier_name: carrier || 'Unknown',
      carrier_link: null,
      estimated_delivery: null,
      origin_country: null,
      destination_country: null,
      last_location: null,
      last_update: null,
      events: [],
      error: errorMessage,
    }
  }
}
